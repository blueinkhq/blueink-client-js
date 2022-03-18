module.exports = {
	transform: {
		"^.+\\.jsx?$": "babel-jest",
	},
	setupFilesAfterEnv: [require.resolve("regenerator-runtime/runtime")],
	// rootDir: "./",
	modulePaths: ["<rootDir>/src/"],
	moduleDirectories: ["src", "node_modules"],
	moduleFileExtensions: ["js", "json", "ts"],
	testEnvironment: "node",
};
