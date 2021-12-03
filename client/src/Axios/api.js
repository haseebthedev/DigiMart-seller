import axios from "axios";

export default axios.create({
	// baseURL: `https://digi-mart-server.herokuapp.com`,
	baseURL: `http://localhost:8080`,
});
