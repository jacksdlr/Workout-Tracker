const xhttp = new XMLHttpRequest()

const form = document.getElementById("exercise-form")
const workoutContainer = document.querySelector(".workout-container")
const displayDate = document.getElementById("display-date")

xhttp.open("GET", "/workouts/" + new Date().toISOString().split("T")[0])
xhttp.send()
xhttp.onload = function () {
    console.log(JSON.stringify(JSON.parse(this.response), null, 4))
    renderWorkout(JSON.parse(this.response))
}

form.addEventListener("submit", () => {
    setTimeout(() => {
        // Get the date and submit a GET request to return the user's workout for that date
        const inputDate = document.getElementById("workout-input").value
        
        xhttp.open("GET", "/workouts/" + inputDate)
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
    if (data.date != displayDate.value) {
        const existingContainers = workoutContainer.querySelectorAll(".exercise-container")
        existingContainers.forEach(container => container.remove())
    }
    // ADD A TITLE FOR THE WORKOUT
    displayDate.value = data.date
    data.exercises.forEach(exercise => {
        let exerciseContainer = document.getElementById(exercise._id)
        // APPEND SOMETHING LIKE (WORKOUT FOR: <DATE>)
        console.log(exerciseContainer)
        if (!exerciseContainer) {
            createExerciseContainer(exercise)
            createSetContainers(exercise)
        } else {
            createSetContainers(exercise)
        }
    })
}

const createExerciseContainer = (exercise) => {
    exerciseContainer = document.createElement("div")
    exerciseContainer.classList.add("exercise-container")
    exerciseContainer.setAttribute("id", exercise._id)
    workoutContainer.appendChild(exerciseContainer)
    // APPEND THE EXERCISE NAME (H1, ID, ETC.)
    // CHECK IF COMMENTS AND APPEND DIV FOR THEM
}

const createSetContainers = (exercise) => {
    exercise.sets.forEach(set => {
        let setContainer = document.getElementById(set._id)
        if (!setContainer) {
            setContainer = document.createElement("div")
            setContainer.classList.add("set-container")
            setContainer.setAttribute("id", set._id)
            exerciseContainer.appendChild(setContainer)
            populateSetContainers(set, setContainer)
        } else {
            let existingDetails = setContainer.lastChild
            setContainer.removeChild(existingDetails)
            populateSetContainers(set, setContainer)
        }
    })
}

const populateSetContainers = (set, setContainer) => {
    let setDetails = document.createElement("p")
    setDetails.insertAdjacentText("afterbegin", `${set.sets_count} set(s) using ${set.set_weight} for ${set.set_reps} reps, superset with ${set.superset_exercise} using ${set.superset_weight} for ${set.superset_reps} reps`)
    setContainer.appendChild(setDetails)
    // LOGIC FOR VARIABLES, CREATE DIFFERENT SENTENCE STRUCTURE FOR DIFFERENT COMBINATIONS
}