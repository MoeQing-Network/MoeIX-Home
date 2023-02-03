import { IXPMemberListSchema } from "../schema/ixf.d";
import axios from "axios";
export const getMembers = async (ixfEndpoint: string): Promise<IXPMemberListSchema> => {
	const Response = await axios.get(ixfEndpoint);
	if (Response.status != 200) {
		throw new Error("IX-F Member Export Request Error");
	}
	const data = Response.data;
	if (!("version" in data)) {
		throw new Error("Not IX-F Member Export file.");
	}
	if (parseFloat(data.version) != 0.6) {
		throw new Error("IX-F Member Export file version is not supported.");
	}
	return data;
};
export const createPage = (id: string, title: string, subTitle: string) => {
	const App = document.createElement("div");
	App.id = id;
	App.classList.add("app");
	App.appendChild(
		(() => {
			const Headers = document.createElement("header");
			const Title = document.createElement("h1");
			Title.innerHTML = title;
			Headers.appendChild(Title);
			const SubTitle = document.createElement("description");
			SubTitle.innerHTML = subTitle;
			Headers.appendChild(SubTitle);
			return Headers;
		})()
	);
	return App;
};
