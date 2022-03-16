module.exports = {
	transform: {
		"^.+\\.jsx?$": "babel-jest",
	},
	setupFilesAfterEnv: [require.resolve("regenerator-runtime/runtime")],
};
