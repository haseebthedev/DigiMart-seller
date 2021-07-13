import axios from "axios";

// // retriving the Auth Token
// const data = localStorage.getItem("USER_DATA");
// if (data != null) {
// 	const token = JSON.parse(data).token;
// 	axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// }

// console.log(axios.defaults.headers.common["Authorization"]);

export default axios.create({
	baseURL: `http://localhost:8080`,
});
