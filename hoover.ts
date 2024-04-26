import {mkdir} from "fs/promises"

type Track = {
    key: string
    name: string
    created: number
    modified: number
    coverUrl: string
    snapshotUrl: string
    user: {
        key: string
        name: string
        avatar: string
    }
    bpm: number
    genreName: string
    duration: number // milliseconds
}

type Page = {
    name: string
    tracks: Array<Track>
    next: string
}

const fetchUserTracks = async (userKey: string): Promise<{ name: string, tracks: ReadonlyArray<Track> }> => {
    let url = `https://api.audiotool.com/user/${userKey}/tracks.json?limit=100&cover=512`
    const tracks: Track[] = []
    while (true) {
        const page = (await fetch(url).then(x => x.json())) as Page
        tracks.push(...page.tracks)
        if (page.next === undefined) {
            return {name: page.name, tracks}
        }
        url = page.next
    }
}

const downloadTracks = async (path: string, tracks: ReadonlyArray<Track>) => {
    const toFilename = (input: string): string => input.replace(/[\/:*?"<>|]/g, "_")

    for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i]
        const filename = toFilename(track.name)
        const url = `https://api.audiotool.com/track/${track.key}/play.mp3`
        console.log(`download #${i + 1} '${track.name}' and save as '${filename}'`)
        await Bun.write(`${path}/${filename}.mp3`, await fetch(url))
    }
}

(async () => {
    const args = Bun.argv.slice(2)
    if (args.length !== 2) {
        console.error(`Usage: bun run hoover.ts user kurpingspace2`)
        process.exit(1)
    }
    console.debug(`Hoovering Api. Scope: '${args[0]}': ${args[1]}`)
    const [scope, key] = args
    if (scope !== "user") {
        console.error("Only fetching user api is implemented yet.")
        process.exit(1)
    }
    const path = `./mp3/${key}`
    try {
        await mkdir(path, {recursive: true})
    } catch (reason) {
        console.error(reason)
        process.exit(1)
    }
    try {
        const result = await fetchUserTracks(args[1])
        console.debug(`found ${result.tracks.length} ${result.name}`)
        await downloadTracks(path, result.tracks)
        console.debug(`downloaded ${result.tracks.length} tracks.`)
    } catch (reason) {
        console.error(reason)
        process.exit(1)
    }
    process.exit(0)
})()