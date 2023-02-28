# <p align="center">⭐ discord-canvas-card</p>

<p align="center">Are you developing a bot using DiscordJS and you need beautiful images created using Canvas?</p>

<p align="center">You can create great welcome, goodbye, rank, info banner images fully customizable using the many easy-to-use features!</p>

> <p align="center">TypeScript</p>

## 👨🏻‍💻 Installation <a name="Installation"></a>

```bash
$ npm install discord-card-canvas
```

## Features

-   🎨 Canvas only, no third-party libraries
-   📦 Easy to install & use



# 🧾 Examples

## Example Rank

<img src="https://i.imgur.com/rtiKAd1.png"/>

```ts
const canvasRank = await new RankCardBuilder({
    currentLvl: 102,
    currentRank: 563,
    currentXP: 71032,
    requiredXP: 95195,
    backgroundColor: { background: '#070d19', bubbles: '#0ca7ff' },
    // backgroundImgURL: 'any_image.png', ( you can also use )
    avatarImgURL: 'avatar.jpg',
    nicknameText: { content: 'xNinja_Catx', font: 'Nunito', color: '#0CA7FF' },
    userStatus: 'idle',
}).build();

// Saving an image
fs.writeFileSync('rank_blue.png', canvasRank.toBuffer());

// Example of sending to a channel
channel.send(files: [{ attachment: canvasRank.toBuffer(), name: 'rank.png' }])
```

---

<img src="https://i.imgur.com/z8cCddN.png"/>

```ts
const canvasRank = await new RankCardBuilder({
    currentLvl: 50,
    currentRank: 3,
    currentXP: 23478,
    requiredXP: 68195,
    fontDefault: 'Inter',
    backgroundColor: { background: '#fff', bubbles: '#f48b2d' },
    avatarImgURL: 'avatar.jpg',
    nicknameText: { content: 'Good_Hateful' },
    userStatus: 'online',
    requiredXPColor: '#7F8381',
    currentXPColor: '#f48b2d',
    avatarBackgroundColor: '#fbbf60',
    colorTextDefault: '#f48b2d',
    progressBarColor: '#f48b2d',
}).build();

fs.writeFileSync('rank_orange.png', canvasRank.toBuffer());
```

---

## Example Welcome/Leave

<img src="https://i.imgur.com/F7PVnke.png"/>

```ts
let cv = new WelcomeBuilder({
    // backgroundImgURL: 'any_image.png', ( you can also use )
    fontDefault: 'Inter',
    nicknameText: { color: '#0CA7FF', content: 'ДобраяKnopKa#2575' },
    secondText: { color: '#0CA7FF', content: 'Raccoon Bot Discord' },
    avatarImgURL: 'Sad_KnopKa.gif',
}).build();

fs.writeFileSync('welcome-1.png', canvas1.toBuffer());
```

---

<img src="https://i.imgur.com/dLM4shk.png"/>

```ts
let cv = new LeaveBuilder({
    nicknameText: { content: 'ДобраяKnopKa#2575' },
    avatarImgURL: 'Sad_KnopKa.gif',
});
cv.setFontDefault('Inter');
cv.setSecondText({ content: 'Raccoon Bot Discord' }).build();

fs.writeFileSync('welcome-2.png', canvas2.toBuffer());
```

> ⚠️For full control when creating a card, use BaseCardBuilder.

---

## Example Info

<img src="https://i.imgur.com/KsBpoIu.png"/>

```ts
const canvasInfo = await new InfoCardBuilder({
    // backgroundImgURL: 'any_image.png', ( you can also use )
    backgroundColor: {background: '#fff', waves: '#0ca7ff'}
    mainText: { content: 'INFORMATION' },
}).build();

fs.writeFileSync('info.png', canvasInfo.toBuffer());
```

# 📘 Documentation

## **📌 Classes**

## BaseCardBuilder
Creating a base card with a resolution of 800x350 px.

- `mainText` - Text above the user's nickname.
- `nicknameText` - User's nickname.
- `secondText` - Text under the user's nickname.
- `backgroundImgURL` - URL to the background image.
- `backgroundColor` - Background color (if no background image is selected).
    - Default: `'#BBE8FF'`
- `avatarImgURL` - URL to the avatar user image.
- `avatarBorderColor` - The outline color of the user's avatar.
    - Default: `'#0CA7FF'`
- `avatarBorderStyle` - Border type for avatar ('fill' fits transparent avatars)
    - `'fill'` or `'stroke'`
- `fontDefault` - Default font. Applies if a specific font is not selected in the TextCard object.
    - Default: `'Nunito'`
- `colorTextDefault` - Default text color. Applies if a specific text color is not selected in the Text Card object.
    - Default: `'#0CA7FF'`

> 🔹 To simplify the creation of welcome, leave cards, you can use the **WelcomeBuilder** and **LeaveBuilder**.

---

## RankCardBuilder
Creating a user rating card with a resolution of 1000x250 px.

- `nicknameText *` - User's nickname.
- `currentLvl *` - The user's current level.
- `currentRank *` - The user's current rank.
- `currentXP *` - The user's current experience.
- `requiredXP *` - Required experience to the next level
- `userStatus *` - User status.
- `backgroundImgURL` - URL to the background image.
- `backgroundColor` - Background color (if no background image is selected).
    - Default: `'#BBE8FF'`
- `avatarImgURL` - URL to the avatar user image.
- `avatarBackgroundEnable` - Whether the circle behind the avatar is enabled.
    - Default: `True`
- `avatarBackgroundColor` - The color of the circle behind the avatar.
    - Default: `'#0CA7FF'`
- `fontDefault` - Default font. Applies if a specific font is not selected in the TextCard object.
    - Default: `'Nunito'`
- `colorTextDefault` - Default text color. Applies if a specific text color is not selected in the Text Card object.
    - Default: `'#0CA7FF'`
- `progressBarColor` - The color of the progress bar.
    - Default: `'#0CA7FF'`
- `currentXPColor` - The color of the current experience number.
    - Default: `'#0CA7FF'`
- `requiredXPColor` - The color of the required experience number.
    - Default: `'#7F8384'`
- `lvlPrefix` - Text before the level number.
    - Default: `'LVL'`
- `rankPrefix` - Text before the rank number.
    - Default: `'RANK'`
> 🔹 `*` - Required parameters 

---

## InfoCardBuilder
Creating a card-an information header.
- `backgroundImgURL` - URL to the background image.
- `backgroundColor` - Background color (if no background image is selected).
- `mainText` - The main text on the card.


> ✍️ **Important:** To create a canvas object, use the **build()** method of the class.

---

## **🔖 Additional Types and Interfaces**

- `Color` - **String** - RGB | RGBA | HEX
- `FontResolvable` - **String** - 'Inter' | 'Nunito' | 'Manrope' | 'Open Sans' | 'Raleway' | 'Roboto Slab' | 'Spectral SC' | 'Bellota'
- `UserStatus` - **String** - 'online' | 'idle' | 'dnd' | 'offline' | 'invisible' | 'streaming'
- `BorderStyle` - **String** - 'fill' | 'stroke'
- `TextCard` - ```{
    content: string;
    color?: Color;
    font?: FontResolvable;
}```
- `BackgroundBaseColor` - ```{
    background: Color;
    waves?: Color;
}```
- `BackgroundRankColor` - ```{
    background: Color;
    bubbles?: Color;
}```

# 📗 Utils
- `rgbToHex` - Color conversion from rgb | rgba to hex
- `hexToRgbA` - Color conversion from hex to rgba

# 💎 Contributing
If you have a request for a new feature you can open an issue on Github.

# 📄 Credits
Made by [gusarovv](https://github.com/gusarovv) with ❤️

Please give a ⭐️ if this project helped you!