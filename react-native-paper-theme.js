import { DefaultTheme, configureFonts } from "react-native-paper";

const fontConfig = {
	regular: {
		fontFamily: "Gaegu-Regular",
		fontWeight: "normal",
	},
};

export const theme = {
	...DefaultTheme,
	fonts: configureFonts(fontConfig),
	colors: {
		...DefaultTheme.colors,
		primary: "#F2BED1",
		// primary: "black",
	},
};
