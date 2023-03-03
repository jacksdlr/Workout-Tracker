const xhttp = new XMLHttpRequest()

const form = document.getElementById("exercise-form")
const workoutContainer = document.querySelector(".workout-container")
const displayDate = document.getElementById("display-date")
document.getElementById("workout-input").value = new Date().toISOString().split("T")[0]

const submitRequest = (date) => {
    xhttp.open("GET", "/workouts/" + date)
    xhttp.send()
    xhttp.onload = function () {
        if (this.response) {
            console.log(JSON.stringify(JSON.parse(this.response), null, 4))
            renderWorkout(JSON.parse(this.response))
            return
        } else {
            renderWorkout("not found")
            return
        }
    }
}

submitRequest(new Date().toISOString().split("T")[0])

form.addEventListener("submit", () => {
    setTimeout(() => {
        // Get the date and submit a GET request to return the user's workout for that date
        const inputDate = document.getElementById("workout-input").value
        submitRequest(inputDate)
        resetComments()
    }, 250);

})

displayDate.addEventListener("change", () => {
    setTimeout(() => {
        // Get the date and submit a GET request to return the user's workout for that date
        const inputDate = displayDate.value
        
        submitRequest(inputDate)
    }, 250);

})

const renderWorkout = (data, reset) => {
    if (data == "not found") {
        alert("No workout found for that date")
        return submitRequest(new Date().toISOString().split("T")[0])
    }
    if (data.date != displayDate.value || reset == true) {
        const existingContainers = workoutContainer.querySelectorAll(".exercise-container")
        existingContainers.forEach(container => container.remove())
    }
    displayDate.value = data.date
    data.exercises.forEach(exercise => {
        let exerciseContainer = document.getElementById(exercise._id)
        if (!exerciseContainer) {
            createExerciseContainer(exercise)
            addExerciseComments(exercise)
            createSetContainers(exercise)
        } else {
            addExerciseComments(exercise)
            createSetContainers(exercise)
        }
    })
}

const createExerciseContainer = (exercise) => {
    exerciseContainer = document.createElement("div")
    exerciseContainer.classList.add("exercise-container")
    exerciseContainer.setAttribute("id", exercise._id)
    workoutContainer.appendChild(exerciseContainer)

    let exerciseName = document.createElement("h2")
    exerciseName.classList.add("exercise-name")
    exerciseName.setAttribute("id", exercise._id+"-name")
    exerciseName.insertAdjacentText("afterbegin", exercise.exercise_name)
    exerciseContainer.appendChild(exerciseName)

    // Append exercise comments (if they exist)

    // EXERCISE COMMENTS SHOULD BE A LIGHT SHADED BOX BELOW THE EXERCISE NAME, ITALIC STYLING, NOT TOO MUCH SCREEN SPACE TAKEN
}

const addExerciseComments = (exercise) => {
    let exerciseComments = document.getElementById(exercise._id+"-comments")
    if (!exerciseComments && exercise.comments != "") {
        let exerciseComments = document.createElement("div")
        exerciseComments.classList.add("exercise-comments")
        exerciseComments.setAttribute("id", exercise._id+"-comments")
        exercise.comments.forEach(comment => {
            let exerciseComment = document.createElement("li")
            exerciseComment.textContent = comment
            exerciseComments.appendChild(exerciseComment)
        })
        document.getElementById(exercise._id).appendChild(exerciseComments)
    } else if (exercise.comments != "") {
        exerciseComments.remove()
        exerciseComments = document.createElement("div")
        exerciseComments.classList.add("exercise-comments")
        exerciseComments.setAttribute("id", exercise._id+"-comments")
        exercise.comments.forEach(comment => {
            let exerciseComment = document.createElement("li")
            exerciseComment.textContent = comment
            exerciseComments.appendChild(exerciseComment)
        })
        document.getElementById(exercise._id+"-name").insertAdjacentElement("afterend", exerciseComments)
    }
}

const createSetContainers = (exercise) => {
    exerciseContainer = document.getElementById(exercise._id)
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