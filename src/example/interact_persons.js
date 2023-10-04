require("dotenv/config");
const inquirer = require("inquirer");
const chalk = require("chalk");
const { Client, PersonHelper } = require("../../index");

const client = new Client(process.env.BLUEINK_PRIVATE_API_KEY);
const ph = new PersonHelper();

const personSampleUpdate = {
  name: 'Stewie Griffin',
  channels: []
};

const interactPersons = async () => {
  try {
    console.log(chalk.bgBlue.white("Using Persons is easy\n"));

    const action = await askAction();

    switch (action) {
      case "Create Person": {
        // Make up some metadata to add to the person
        const metadata = {
          number: 1,
          string: "stringy",
          dict: { number: 2 },
          list: [3]
        }
        //# Set the metadata of the person
        ph.setMetadata(metadata);

        // Set the persons name
        ph.setName("Brian Griffin");
        // Add email contacts for the person
        ph.addEmail("brian.griffin@gmail.com");
        ph.addEmail("stewie.griffin@gmail.com");

        // Get all of the emails for the person
        let allCurrentEmails = ph.getEmails();
        console.log("All Current Emails:", allCurrentEmails)

        // Remove an email from the list
        allCurrentEmails.splice(allCurrentEmails.indexOf("test@email.com"), 1);

        // Overwrite the existing email list with this new list
        // Effectively removing test@email.com list
        ph.setEmails(allCurrentEmails);

        // Add phone number contact for the person
        ph.addPhone("5055551212");
        ph.addPhone("5055551213");
        ph.addPhone("5055551214");

        // Get all of the phone numbers for the person
        let allCurrentPhones = ph.getPhones();
        console.log("All Current Phones:", allCurrentPhones)
        // Remove a phone number from the list
        allCurrentPhones.pop();

        // Overwrite the existing phone list with this new list
        // Effectively removing last phone number
        ph.setPhones(allCurrentPhones);

        createResp = await client.persons.createFromPersonHelper(ph);
        person = createResp.data;
        console.log(`Created person ${person.id}`);
        break;
      }

      case "Update Person": {
        const person_id = await askPersonId();
        const updateResp = await client.persons.update(
          person_id,
          personSampleUpdate
        );
        person = updateResp.data;
        console.log(`Updated person ${JSON.stringify(person)}`);
        break;
      }

      case "Retrieve Person": {
        const person_id = await askPersonId();
        const retrieveResp = await client.persons.retrieve(person_id);
        person = retrieveResp.data;
        console.log(`Retrieved person ${JSON.stringify(person)}`);
        break;
      }

      case "Delete Person": {
        const person_id = await askPersonId();
        const deleteResp = await client.persons.delete(person_id);
        console.log(`Deleted person ${person_id}`);
        break;
      }
    }
  } catch (error) {
    if (error.response) {
      console.log(error.response);
      console.log(chalk.bgRed.white("\nError: "), error.response.data);
    } else {
      console.log(error);
    }
  }
};

const askAction = async () => {
  const answer = await inquirer.prompt({
    name: "action",
    type: "list",
    message: "Choose an action to continue",
    choices: [
      "Create Person",
      "Update Person",
      "Retrieve Person",
      "Delete Person",
    ],
  });
  return answer.action;
};

const askPersonId = async () => {
  console.log("\nEnter a Person ID");
  let person_id = "";
  while (!person_id) {
    const answer = await inquirer.prompt({
      name: "person_id",
      type: "input",
    });
    person_id = answer.person_id;
  }
  return person_id;
};

interactPersons();
