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

const toSafeFileName = (input: string): string => input.replace(/[\/:*?"<>|]/g, "_").substring(0, 32)

const fetchUserTracks = async (scope: string, userKey: string): Promise<{
    name: string,
    tracks: ReadonlyArray<Track>
}> => {
    let url = `https://api.audiotool.com/${scope}/${userKey}/tracks.json?limit=100`
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

const downloadTracks = async (path: string, format: string, tracks: ReadonlyArray<Track>) => {
    for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i]
        const filename = toSafeFileName(track.name)
        const url = `https://api.audiotool.com/track/${track.key}/play.${format}`
        console.log(`download #${i + 1} '${track.name}' and save as '${filename}'`)
        await Bun.write(`${path}/${filename}.${format}`, await fetch(url))
    }
}

(async () => {
    const args = Bun.argv.slice(2)
    if (args.length !== 3) {
        console.error(`Usage: bun run hoover.ts user kurpingspace2 ogg`)
        process.exit(1)
    }
    console.debug(`Hoovering Api. Scope: '${args[0]}': ${args[1]}, format: ${args[2]}`)
    const [scope, key, format] = args
    if (scope !== "user" && scope !== "album") {
        console.error("Only user & album api is implemented yet.")
        process.exit(1)
    }
    if (format !== "mp3" && format !== "ogg") {
        console.error("Only mp3 or ogg-vorbis is implemented yet.")
        process.exit(1)
    }
    const path = `./${key}/${format}`
    try {
        await mkdir(path, {recursive: true})
    } catch (reason) {
        console.error(reason)
        process.exit(1)
    }
    try {
        const result = await fetchUserTracks(scope, key)
        console.debug(`found ${result.tracks.length} ${result.name}`)
        await downloadTracks(path, format, result.tracks)
        console.debug(`downloaded ${result.tracks.length} tracks.`)
    } catch (reason) {
        console.error(reason)
        process.exit(1)
    }
    process.exit(0)
})()