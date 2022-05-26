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

	serverError: () => {
		return {
			status: "Internal Server Error",
			message: "Internal Server Error"
		}
	},

	notFound: (username) => {
		return {
			status: "Not Found",
			message: `Cant find record with id/username ${username}`
		}
	},

	duplicate: (username) => {
		return {
			status: "Duplicate",
			message: `Record with id/username ${username} already exist`
		}
	}

}