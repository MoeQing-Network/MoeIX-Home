import "./style.css";
import { createPage, getMembers } from "./lib/getPeers";
window.addEventListener("load", () => {
	getMembers("https://ixpm-sea.moeqing.com/api/v4/member-export/ixf/0.6").then(
		(list) => {
			const seaMembers = createPage("app-sea-members", "MoeIX", "Seattle");
			seaMembers.style.display = "none";
			const groups = document.createElement("div");
			groups.classList.add("group");
			groups.classList.add("pops");
			groups.id = "pops";
			list.member_list.forEach((member) => {
				const memberElement = document.createElement("div");
				memberElement.classList.add("pop");
				if (
					member.connection_list.find((k) => k.ixp_id == 1)?.state != "active"
				)
					memberElement.setAttribute("status", "error");
				else memberElement.setAttribute("status", "working");

				const connection = member.connection_list.find((k) => k.ixp_id == 1);

				const span = document.createElement("span");
				const name = document.createElement("name");
				const asn = document.createElement("asn");
				name.innerHTML = member.name ?? `AS${member.asnum}`;
				asn.innerHTML = `AS${member.asnum} @ ${
					connection?.if_list?.find((k) => k.switch_id == 1)?.if_speed ?? 0
				}Mbps`;
				span.appendChild(name);
				span.appendChild(asn);
				memberElement.appendChild(span);

				memberElement.appendChild(document.createElement("br"));

				const vSwitch = connection?.vlan_list?.find((k) => k.vlan_id == 1);
				if (vSwitch?.ipv4) {
					const ipv4 = document.createElement("ipv4");
					ipv4.innerHTML = `- <code>${vSwitch.ipv4.address}</code>`;
					memberElement.appendChild(ipv4);
				}
				if (vSwitch?.ipv6) {
					const ipv6 = document.createElement("ipv6");
					ipv6.innerHTML = `- <code>${vSwitch.ipv6.address}</code>`;
					memberElement.appendChild(ipv6);
				}

				memberElement.appendChild(document.createElement("br"));

				const asSets = vSwitch?.ipv4?.as_macro ?? vSwitch?.ipv6?.as_macro;
				if (asSets) {
					const ASSets = document.createElement("div");
					ASSets.innerHTML = `AS-SETS: <code>${asSets}</code>`;
					memberElement.appendChild(ASSets);
				}

				const type = document.createElement("div");
				type.innerHTML = `Peering Policy: ${member.peering_policy ?? "unknown"}`;
				memberElement.appendChild(type);

				groups.appendChild(memberElement);
			});
			seaMembers.appendChild(groups);
			document.querySelector("body")?.appendChild(seaMembers);
		}
	);

	document.getElementById("sea-member")!.addEventListener("click", () => {
		if (document.getElementById("app-sea-members")) {
			document.getElementById("app-main")!.style.display = "none";
			document.getElementById("app-sea-members")!.style.display = "block";
		}
	});
});
