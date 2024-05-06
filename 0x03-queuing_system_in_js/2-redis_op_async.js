import { createClient, print } from 'redis';
import { promisify } from 'util'

const client = createClient()
const asyncoop = promisify(client.get).bind(client)

client.on('connect', () => {
    console.log("Redis client connected to the server")
})
client.on('error', (err) => {
    console.log("Redis client not connected to the server:", err)
})

function setNewSchool(schoolName, value) {
    client.set(schoolName, value, (err, _) => {
        if(err) {
            console.log(err)
        } else {
            print('Reply: OK')
        }
    })
}

async function displaySchoolValue(schoolName) {
    const ouput = await asyncoop(schoolName)
    console.log(ouput)
}


displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
