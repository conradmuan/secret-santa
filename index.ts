
import fs from "fs";
import path from "path";

// Define the Participant type
type Participant = {
    name: string;
    exclusions: string[];
};

function secretSantaDraw(participants: Participant[]): Map<string, string> {
    const drawResult = new Map<string, string>();
    const availableRecipients = [...participants];

    for (const participant of participants) {
        const validRecipients = availableRecipients.filter(
            (recipient) =>
                recipient.name !== participant.name &&
                !participant.exclusions.includes(recipient.name)
        );

        if (validRecipients.length === 0) {
            throw new Error(`No valid recipient available for ${participant.name}.`);
        }

        const recipientIndex = Math.floor(Math.random() * validRecipients.length);
        const recipient = validRecipients[recipientIndex];

        drawResult.set(participant.name, recipient.name);
        availableRecipients.splice(availableRecipients.indexOf(recipient), 1);
    }

    return drawResult;
}

// Load participants from a JSON file
function loadParticipantsFromFile(filePath: string): Participant[] {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data) as Participant[];
}

// Main function to handle CLI input
function main() {
    const args = process.argv.slice(2); // Get command-line arguments
    if (args.length < 1) {
        console.error("Usage: ts-node secret-santa.ts <participants.json>");
        process.exit(1);
    }

    const filePath = path.resolve(args[0]);
    try {
        const participants = loadParticipantsFromFile(filePath);
        const result = secretSantaDraw(participants);

        console.log("Secret Santa Draw:");
        result.forEach((recipient, giver) =>
            console.log(`${giver} → ${recipient}`)
        );
    } catch (error) {
        console.error((error as Error).message);
        process.exit(1);
    }
}

main();