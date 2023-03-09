const xhttp = new XMLHttpRequest()

const form = document.getElementById("exercise-form")
const workoutContainer = document.querySelector(".workout-container")
let displayDate = document.getElementById("display-date")
let inputDate = document.getElementById("workout-input")

const submitRequest = (date, reset) => {
    xhttp.open("GET", "/workouts/" + date)
    xhttp.send()
    xhttp.onload = function () {
        if (this.response) {
            console.log(JSON.stringify(JSON.parse(this.response), null, 4))
            renderWorkout(JSON.parse(this.response), reset, date)
            toggleVisibility()
            populate()
            return
        } else {
            renderWorkout("not found", reset, date)
            toggleVisibility()
            return
        }
    }
}

let dateToSend = inputDate.value
if (dateToSend == "") {
    dateToSend = new Date().toISOString().split("T")[0]
}

submitRequest(dateToSend)

form.addEventListener("submit", () => {
    setTimeout(() => {
        // Get the date and submit a GET request to return the user's workout for that date
        const inputDate = document.getElementById("workout-input").value
        submitRequest(inputDate, true)
        
    }, 250);
    
})

displayDate.addEventListener("change", () => {
    setTimeout(() => {
        const inputDate = displayDate.value
        submitRequest(inputDate, true)
    }, 250);

})

const renderWorkout = (data, reset, date) => {
    let notFound = document.getElementById("not-found")
    if (notFound) {
        notFound.remove()
    }
    if (data == "not found") {
        notFound = document.createElement("p")
        notFound.setAttribute("id", "not-found")
        notFound.textContent = "No workout exists for this date..."
        workoutContainer.appendChild(notFound)
        const existingContainers = workoutContainer.querySelectorAll(".exercise-container")
        existingContainers.forEach(container => container.remove())
        workoutContainer.appendChild(notFound)
        displayDate.value = date
        return
    }
    if (data.date != displayDate.value || reset == true) {
        const existingContainers = workoutContainer.querySelectorAll(".exercise-container")
        existingContainers.forEach(container => container.remove())
    }
    inputDate.value = dateToSend
    displayDate.value = data.date
    data.exercises.forEach(exercise => {
        let exerciseContainer = document.getElementById(exercise._id)
        if (!exerciseContainer) {
            createExerciseContainer(exercise)
            addExerciseComments(exercise)
            createweightContainers(exercise)
        } else {
            addExerciseComments(exercise)
            createweightContainers(exercise)
        }
    })
}

const createExerciseContainer = (exercise) => {
    exerciseContainer = document.createElement("div")
    exerciseContainer.classList.add("exercise-container")
    exerciseContainer.setAttribute("id", exercise._id)
    workoutContainer.appendChild(exerciseContainer)

    let exerciseComments = document.createElement("div")
    exerciseComments.classList.add("exercise-comments")
    exerciseComments.setAttribute("id", exercise._id + "-comments")
    exerciseContainer.appendChild(exerciseComments)

    let exerciseName = document.createElement("h2")
    exerciseName.classList.add("exercise-name")
    exerciseName.setAttribute("id", exercise._id + "-name")
    exerciseName.insertAdjacentText("afterbegin", exercise.exercise_name)
    exerciseContainer.appendChild(exerciseName)

    // EXERCISE COMMENTS SHOULD BE A LIGHT SHADED BOX BELOW THE EXERCISE NAME, ITALIC STYLING, NOT TOO MUCH SCREEN SPACE TAKEN
}

const addExerciseComments = (exercise) => {
    let exerciseComments = document.getElementById(exercise._id + "-comments")
    if (exercise.comments != "") {
        let existingComments = exerciseComments.querySelectorAll("li")
        existingComments.forEach(comment => comment.remove())
        exercise.comments.forEach(comment => {
            let exerciseComment = document.createElement("li")
            exerciseComment.textContent = comment
            exerciseComments.appendChild(exerciseComment)
        })
        document.getElementById(exercise._id + "-name").insertAdjacentElement("afterend", exerciseComments)
    }
}

const createweightContainers = (exercise) => {
    exerciseContainer = document.getElementById(exercise._id)
    exercise.sets.forEach(set => {
        let weightContainer = document.getElementById(set._id)
        if (!weightContainer) {
            weightContainer = document.createElement("div")
            weightContainer.classList.add("weight-container")
            weightContainer.setAttribute("id", set._id)
            exerciseContainer.appendChild(weightContainer)
            populateweightContainers(set, weightContainer)
        } else {
            weightContainer.remove()
            weightContainer = document.createElement("div")
            weightContainer.classList.add("weight-container")
            weightContainer.setAttribute("id", set._id)
            exerciseContainer.appendChild(weightContainer)
            populateweightContainers(set, weightContainer)
        }
    })

}

const populateweightContainers = (set, weightContainer) => {
    // Create the element that holds that set data
    let setWeightAndCount = document.createElement("div")
    setWeightAndCount.classList.add("set-weight-and-count")

    // Descructure all possible set variables
    let {
        set_weight,
        set_reps,
        superset_exercise,
        superset_weight,
        superset_reps,
        sets_count
    } = set

    let setWeight = document.createElement("h3")
    setWeight.classList.add("set-weight")
    setWeight.textContent = set_weight
    setWeightAndCount.appendChild(setWeight)

    let setCount = document.createElement("h3")
    setCount.classList.add("set-count")

    // Get the sets count so that grammar is correct when displaying set data
    if (sets_count == 1) {
        setCount.textContent = "1 set"
    } else if (sets_count > 1) {
        setCount.textContent = `${sets_count} sets`
    }
    setWeightAndCount.appendChild(setCount)

    let setDetails = document.createElement("div")
    setDetails.classList.add("set-details")

    if (set_reps != "") {
        let setReps = document.createElement("p")
        setReps.classList.add("set-reps")
        setReps.textContent = `Reps: ${set_reps}`
        setDetails.appendChild(setReps)
    }

    if (set.comments != "") {
        let setComments = document.createElement("ul")
        setComments.classList.add("set-comments")
        set.comments.forEach(comment => {
            let newComment = document.createElement("li")
            newComment.textContent = comment
            setComments.appendChild(newComment)
        })
        setDetails.appendChild(setComments)
    }

    weightContainer.appendChild(setWeightAndCount)
    weightContainer.appendChild(setDetails)

    if (superset_exercise) {
        setDetails.insertAdjacentText("afterend", "~ Superset with ~")

        let supersetExerciseAndWeight = document.createElement("div")
        supersetExerciseAndWeight.classList.add("superset-exercise-and-weight")

        let supersetExercise = document.createElement("h3")
        supersetExercise.classList.add("superset-exercise")
        supersetExercise.textContent = superset_exercise
        supersetExerciseAndWeight.appendChild(supersetExercise)

        let supersetWeight = document.createElement("h3")
        supersetWeight.classList.add("superset-weight")
        supersetWeight.textContent = superset_weight
        supersetExerciseAndWeight.appendChild(supersetWeight)

        let supersetDetails = document.createElement("div")
        supersetDetails.classList.add("superset-details")

        let supersetReps = document.createElement("p")
        supersetReps.classList.add("set-reps")
        supersetReps.textContent = `Reps: ${superset_reps}`
        supersetDetails.appendChild(supersetReps)

        weightContainer.appendChild(supersetExerciseAndWeight)
        weightContainer.appendChild(supersetDetails)
    }
}