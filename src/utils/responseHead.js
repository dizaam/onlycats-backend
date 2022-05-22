export default {
	success: () => {
		return {
			status: "Success",
			message: "Success"
		}
	}, 

	badRequest: () => {
		return {
			status: "Bad Request",
			message: "Bad Request"
		}
	},

	notFound: (username) => {
		return {
			status: "Not Found",
			message: `Cant find cat with ${username} username`
		}
	}
}