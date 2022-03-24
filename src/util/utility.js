// Just generate some random number for now
export const generateKey = (type) => {
	return (
		type.toString().toUpperCase() +
		"-" +
		Math.floor(Math.random() * 1000).toString()
	);
};
