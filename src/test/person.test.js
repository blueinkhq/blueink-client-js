import {client} from '../../index.js';


describe('Persons', () => {
	const personId = '1ca04018-2996-454b-a938-412bcd5168da';
	it('List all Persons', () => {
		return client.persons.list().then(res => expect(res.status).toBe(200));
	});
	
	it('Retrieve a Person', () => {
		return client.persons.retrieve(personId).then(res => expect(res.data.name).toBe('Test Account'))
	})
})