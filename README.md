# Audiotool Hoover

Download your tracks in one go.

Install https://bun.sh

Open a terminal.

Clone this repository:

```bash
git clone https://github.com/andremichelle/audiotool-hoover.git
```

Go into newly created folder:

```bash
cd audiotool-hoover
```

To install dependencies:

```bash
bun install
```

### Download



{audio-format} is either **mp3** or **ogg** (recommened)

To download user's tracks:

Extract {user-key} from https://www.audiotool.com/user/{user-key}/

```bash
bun run hoover.ts user {user-key} {audio-format}
```

To download album's tracks:

Extract {album-key} from https://www.audiotool.com/album/{album-key}/

```bash
bun run hoover.ts album {album-key} {audio-format}
```

### Example

Downloads all tracks from https://www.audiotool.com/user/audiotool/tracks

```bash
bun run hoover.ts user audiotool ogg
```

This project was created using `bun init` in bun v1.0.6. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
