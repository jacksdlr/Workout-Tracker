const xhttp = new XMLHttpRequest()

const form = document.getElementById("exercise-form")
const workoutContainer = document.querySelector(".workout-container")
const displayDate = document.getElementById("display-date")
document.getElementById("workout-input").value = new Date().toISOString().split("T")[0]

const submitRequest = (date, reset) => {
    xhttp.open("GET", "/workouts/" + date)
    xhttp.send()
    xhttp.onload = function () {
        if (this.response) {
            console.log(JSON.stringify(JSON.parse(this.response), null, 4))
            renderWorkout(JSON.parse(this.response), reset)
            return
        } else {
            renderWorkout("not found", true, date)
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
        return //submitRequest(new Date().toISOString().split("T")[0])
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

    let exerciseComments = document.createElement("div")
    exerciseComments.classList.add("exercise-comments")
    exerciseComments.setAttribute("id", exercise._id+"-comments")
    exerciseContainer.appendChild(exerciseComments)

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
    if (exercise.comments != "") {
        let existingComments = exerciseComments.querySelectorAll("li")
        existingComments.forEach(comment => comment.remove())
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
            let existingDetails = setContainer.firstChild
            let existingComments = setContainer.lastChild
            setContainer.removeChild(existingDetails)
            setContainer.removeChild(existingComments)
            populateSetContainers(set, setContainer)
        }
    })
    
}

const populateSetContainers = (set, setContainer) => {
    // Create the element that holds that set data
    let setDescription = document.createElement("div")
    setDescription.classList.add("set-description")
    setDescription.setAttribute("id", set._id+"-description")

    // Descructure all possible set variables
    let {
        set_weight,
        set_reps,
        superset_exercise,
        superset_weight,
        superset_reps,
        sets_count
    } = set

    // Get the sets count so that grammar is correct when displaying set data
    if (sets_count == 1) {
        var sets = "1 set"
    } else if (sets_count > 1) {
        var sets = `${sets_count} sets`
    }

    // MAYBE ADD A RADIO OPTION FOR SIMPLE VS DESCRIPTIVE DISPLAY (SIMPLE WOULD BE <WEIGHT: XX, REPS: XX, ETC.>)

    if (set_weight && set_reps && superset_weight && superset_reps) {
        // All form inputs
        setContainer.insertAdjacentText("afterbegin", `${sets} using ${set_weight} for ${set_reps} reps, superset with ${superset_exercise} using ${superset_weight} for ${superset_reps} reps`)
    } else if (set_weight && set_reps && superset_weight) {
        // Weight, reps, and superset weight (anywhere with superset weight/reps will have the exercise name)
        setContainer.insertAdjacentText("afterbegin", `${sets} using ${set_weight} for ${set_reps} reps, superset with ${superset_exercise} using ${superset_weight} for unspecified reps`)
    } else if (set_weight && set_reps && superset_reps) {
        // Weight, reps, and superset reps
        setContainer.insertAdjacentText("afterbegin", `${sets} using ${set_weight} for ${set_reps} reps, superset with ${superset_exercise} using unspecified weight for ${superset_reps} reps`)
    } else if (set_weight && superset_weight && superset_reps) {
        // Weight, superset weight, and superset reps
        setContainer.insertAdjacentText("afterbegin", `${sets} using ${set_weight} for unspecified reps, superset with ${superset_exercise} using ${superset_weight} for ${superset_reps} reps`)
    } else if (set_reps && superset_weight && superset_reps) {
        // Reps, superset weight, and superset reps
        setContainer.insertAdjacentText("afterbegin", `${sets} of ${set_reps} reps, superset with ${superset_exercise} using ${superset_weight} for ${superset_reps} reps`)
    } else if (set_weight && set_reps && superset_exercise) {
        // Weight, reps, and only superset exercise name
        setContainer.insertAdjacentText("afterbegin", `${sets} using ${set_weight} for ${set_reps} reps, superset with ${superset_exercise}`)
    } else if (set_weight && set_reps) {
        // Only weight and reps
        setContainer.insertAdjacentText("afterbegin", `${sets} using ${set_weight} for ${set_reps} reps`)
    } else if (set_weight && superset_weight) {
        // Weight and superset weight
        setContainer.insertAdjacentText("afterbegin", `${sets} using ${set_weight}, superset with ${superset_exercise} using ${superset_weight}`)
    } else if (set_weight && superset_reps) {
        // Weight and superset reps
        setContainer.insertAdjacentText("afterbegin", `${sets} using ${set_weight}, superset with ${superset_exercise} for ${superset_reps} reps`)
    } else if (set_reps && superset_weight) {
        // Reps and superset weight
        setContainer.insertAdjacentText("afterbegin", `${sets} of ${set_reps} reps, superset with ${superset_exercise} using ${superset_weight}`)
    } else if (set_reps && superset_reps) {
        // Reps and superset reps
        setContainer.insertAdjacentText("afterbegin", `${sets} of ${set_reps} reps, superset with ${superset_exercise} for ${superset_reps} reps`)
    } else if (set_weight && superset_exercise) {
        // Weight and only superset exercise name
        setContainer.insertAdjacentText("afterbegin", `${sets} using ${set_weight}, superset with ${superset_exercise}`)
    } else if (set_reps && superset_exercise) {
        // Weight and superset exercise name
        setContainer.insertAdjacentText("afterbegin", `${sets} of ${set_reps} reps, superset with ${superset_exercise}`)
    } else if (superset_weight && superset_reps) {
        // Only superset weight and reps
        setContainer.insertAdjacentText("afterbegin", `${sets} superset with ${superset_exercise} using ${superset_weight} for ${superset_reps} reps`)
    } else if (superset_weight) {
        // Only superset weight
        setContainer.insertAdjacentText("afterbegin", `${sets} superset with ${superset_exercise} using ${superset_weight}`)
    } else if (superset_reps) {
        // Only superset rep
        setContainer.insertAdjacentText("afterbegin", `${sets} superset with ${superset_exercise} for ${superset_reps} reps`)
    } else if (set_weight) {
        // Only weight
        setContainer.insertAdjacentText("afterbegin", `${sets} using ${set_weight}`)
    } else if (set_reps) {
        // Only reps
        setContainer.insertAdjacentText("afterbegin", `${sets} of ${set_reps} reps`)
    } else if (superset_exercise) {
        // Only superset exercise name
        setContainer.insertAdjacentText("afterbegin", `${sets} superset with ${superset_exercise}`)
    } else {
        // Only the set count (no other info was input)
        setContainer.insertAdjacentText("afterbegin", `${sets}`)
    }
        
    
    setContainer.appendChild(setDescription)

    let setComments = document.createElement("div")
    setComments.classList.add("set-comments")
    setComments.setAttribute("id", set._id+"-comments")
    set.comments.forEach(comment => {
        let newComment = document.createElement("li")
        newComment.textContent = comment
        setComments.appendChild(newComment)
    })
    setContainer.appendChild(setComments)
    
    
    
}