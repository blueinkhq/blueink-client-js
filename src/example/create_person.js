import 'dotenv/config';
import chalk from 'chalk';
import inquirer from 'inquirer';

import { Client, PersonHelper } from '../blueink/index.js';

const client = new Client(process.env.BLUEINK_PRIVATE_API_KEY);

const askEmail = async () => {
	console.log('\nEnter Email');
	let email = '';
	while (!email) {
		const answer = await inquirer.prompt({
			name: 'email',
			type: 'input',
			default: 'example@email.com',
		});
		email = answer.email;
	}
	return email;
};

const askPhone = async () => {
	console.log('\nEnter Phone');
	let phone = '';
	while (!phone) {
		const answer = await inquirer.prompt({
			name: 'phone',
			type: 'input',
			default: '5035678901',
		});
		phone = answer.phone;
	}
	return phone;
};

const createPerson = async () => {
	try {
		const person = new PersonHelper({
			name: 'Tony Stark',
			metadata: {
				company: 'Stark Industry',
			},
		});

        const email = await askEmail();
		person.addEmail(email);

        const phone = await askPhone();
		person.addPhone(phone);

		const { status, data } = await client.persons.create(person.asData());

		console.log(chalk.bgGreen.black('The Person has been created successfully.'));
		console.log({ status, data });
	} catch (error) {
		if (error.response) {
			console.log(error.response);
			console.log(chalk.bgRed.white('\nError: '), error.response.data);
		} else {
			console.log(error);
		}
	}
};

createPerson();
