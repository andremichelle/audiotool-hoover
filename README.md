# Audiotool Hoover

Download your tracks in one go.

Install https://bun.sh

Clone this repository:

```bash
git clone https://github.com/andremichelle/audiotool-hoover.git
```

To install dependencies:

```bash
bun install
```

### How to

{user-key} is for example https://www.audiotool.com/user/{user-key}/

{album-key} is for example https://www.audiotool.com/album/{album-key}/

{audio-format} is either **mp3** or **ogg**

To download user's tracks:

```bash
bun run hoover.ts user {user-key} {audio-format}
```

To download album's tracks:

```bash
bun run hoover.ts album {album-key} {audio-format}
```

This project was created using `bun init` in bun v1.0.6. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
