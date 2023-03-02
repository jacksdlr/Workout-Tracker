const xhttp = new XMLHttpRequest()

const form = document.getElementById("exercise-form")
const workoutContainer = document.querySelector(".workout-container")

xhttp.open("GET", "/workouts/" + new Date().toISOString().split("T")[0])
xhttp.send()
xhttp.onload = function () {
    console.log(JSON.stringify(JSON.parse(this.response), null, 4))
    renderWorkout(JSON.parse(this.response))
}

form.addEventListener("submit", () => {
    setTimeout(() => {
        // Get the date and submit a GET request to return the user's workout for that date
        const date = document.getElementById("workout-input").value
        console.log(date)
        
        xhttp.open("GET", "/workouts/" + date)
        xhttp.send()
        xhttp.onload = function () {
            // Clear the comment fields
            resetComments()

            // Parse the response data
            console.log(JSON.stringify(JSON.parse(this.response), null, 4))
            renderWorkout(JSON.parse(this.response))
        }
    }, 250);

})

const renderWorkout = (data) => {
    data.forEach(exercise => {
        let exerciseContainer = document.getElementById(exercise._id)
        console.log(exerciseContainer)
        console.log("Test")
        if (!exerciseContainer) {
            console.log("no exercise container found")
            createExerciseContainer(exercise)
            createSetContainers(exercise)
        } else {
            console.log("found exercise container")
            createSetContainers(exercise)
        }
    })
}

const createExerciseContainer = (exercise) => {
    exerciseContainer = document.createElement("div")
    exerciseContainer.classList.add("exercise-container")
    exerciseContainer.setAttribute("id", exercise._id)
    workoutContainer.appendChild(exerciseContainer)
}

const createSetContainers = (exercise) => {
    exercise.sets.forEach(set => {
        let setContainer = document.getElementById(set._id)
        if (!setContainer) {
            console.log("no set container found")
            setContainer = document.createElement("div")
            setContainer.classList.add("set-container")
            setContainer.setAttribute("id", set._id)
            exerciseContainer.appendChild(setContainer)
        } else {
            console.log("found set container")
        }
    })
}