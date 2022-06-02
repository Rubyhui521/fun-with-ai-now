<template>
    <main>
        <h1>FUN WITH AI</h1>
        <h2>Enter Prompt</h2>
        <form @submit.prevent="getResponse">
            <textarea v-model="prompt" placeholder="Example: Write a flower poem."></textarea>
            <br>
            <button type="submit" @click="show = true">Submit</button>
        </form>
        <div v-if="show">
            <h2>Responses</h2>
            <div v-for="(response, id) in responses" :key="id">
                <div class="responses">
                    <p>Prompt: </p>
                    <p>{{ response.prompt }}</p>
                    <p>Response: </p>
                    <p>{{ response.response }}</p>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import { collection, addDoc, query, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore'
import db from './db'

export default {
    data: function () {
        return {
            responses: [],
            prompt: "",
            show: false
        }
    },

    methods: {
        getResponse: async function() {
            if (this.prompt) {
                // fetch API to get response
                const data = {
                    prompt: this.prompt,
                    temperature: 0.5,
                    max_tokens: 64,
                    top_p: 1.0,
                    frequency_penalty: 0.0,
                    presence_penalty: 0.0,
                }

                try {
                    const response = await fetch(
                    'https://api.openai.com/v1/engines/text-curie-001/completions', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.VUE_APP_OPENAI_SECRET}`,
                        },
                        body: JSON.stringify(data),
                    })
                    if (response.ok) {
                        const result = await response.json()
                        this.response = result.choices[0].text
                    }
                }
                catch (err) {
                    throw new Error('We got an error', err)
                }

                // store the prompt and response to firebase
                const c = collection(db, 'responses')
                const document = await addDoc(c, {
                    prompt: this.prompt,
                    response: this.response,
                    createdAt: serverTimestamp()
                })
                console.log(document.id)

                // display all the prompts and responses
                const q = query(collection(db, 'responses'), orderBy('createdAt', 'desc'))

                onSnapshot(q, (snapshot) => {
                    const data = []
                    snapshot.forEach((doc) => data.push({
                        id: doc.id,
                        prompt: doc.data().prompt,
                        response: doc.data().response
                    }))
                    this.responses = data
                })
            } 
        }    
    }
}
</script>

<style scoped>
main {
    width: 60%;
    margin: auto;
}
h1 {
    font-family: 'Quicksand', sans-serif;
    margin-bottom: 40px;
}
h2 {
    font-family: 'Roboto', sans-serif;
}
textarea {
    width: 100%;
    height: 60px;
    border-style: solid;
    font-family: 'Ariel', sans-serif;
    margin-bottom: 10px;
}

button {
    border-style: none;
    border-radius: 3px;
    padding: 5px 10px;
    margin-bottom: 20px;
    background-color: #3498DB;
    color: white;
}

button:hover {
    background-color: #37acfa;
}

.responses {
    padding: 2px 20px;
    margin-bottom: 10px;
    background-color: #EDEFF4;
    font-family: 'Ariel', sans-serif;
    font-weight: lighter;
    display: grid;
    grid-template-columns: 1fr 9fr;
    column-gap: 20px;
}

.responses :nth-child(1),
.responses :nth-child(3) {
    font-weight: bolder;
}
</style>
