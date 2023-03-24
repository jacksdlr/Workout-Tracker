// Hides context menus if clicked outside
document.addEventListener("click", (e) => {
    const contextMenus = document.querySelectorAll(".context-menu")
    contextMenus.forEach(menu => {
        if (e.target.offsetParent != menu) {
            menu.style.top = "0px"
            menu.style.left = "0px"
            menu.style.visibility = "hidden"
        }
    })
    
})

const hideOnClick = (menu) => {
    menu.style.top = "0px"
    menu.style.left = "0px"
    menu.style.visibility = "hidden"
}

// New exercise name
const editExerciseName = (exercise_name, date) => {
    $("#exercise-edit").off()
    $("#exercise-edit").click(() => {
        // Hide exercise context menu
        hideOnClick(exerciseMenu)

        let newName = prompt("New exercise name: ", exercise_name)
        if (newName != null && !newName.match(/^\s+$/) && newName != "" && newName != exercise_name) {
            xhttp.open("POST", "/update/exercise")
            xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
            xhttp.send(JSON.stringify({ exercise_name, newName, date }))
            sessionStorage.exercise_name = newName
            xhttp.onload(() => {
                console.log("im here")
                renderWorkout(JSON.parse(this.response), true, displayDate.value)
                toggleRequired()
                populate()
            })
        }
    })
}


/*

// New exercise comment
let editedComment = prompt("New comment: ", comment)
if (editedComment != null && !editedComment.match(/^\s+$/) && editedComment != "" && editedComment != comment) {
    xhttp.open("POST", "/update/exercise_comments")
    xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
    xhttp.send(JSON.stringify({ exercise_name: exercise.exercise_name, commentIndex: index, editedComment, date: displayDate.value }))
    sessionStorage.exercise_name = exercise.exercise_name
    xhttp.onload(() => {
        renderWorkout(JSON.parse(this.response), true, displayDate.value)
        toggleRequired()
        populate()
    })
}

// New weight
let newWeight = prompt("New weight used: ", set_weight)
if (newWeight != null && !newWeight.match(/^\s+$/) && newWeight != set_weight) {
    if (!newWeight.match(/(^(\d+\.\d{0,2}|\d+)(kg|lbs)$)|(^$)/)) {
        console.log(newWeight)
        alert("Make sure your new weight follows the structure [x]kg/lbs or [x.xx]kg/lbs.")
        return
    } else {
        xhttp.open("POST", "/update/weight")
        xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
        xhttp.send(JSON.stringify({ exercise_name: exercise.exercise_name, set_id: set._id, newWeight, date: displayDate.value }))
        sessionStorage.exercise_name = exercise.exercise_name
        /*
        sessionStorage.set_weight = newWeight.split(/(\d+\.\d{0,2}|\d+)/)[1]
        sessionStorage.set_weight_unit = newWeight.split(/(\d+\.\d{0,2}|\d+)/)[2]
        
        xhttp.onload(() => {
            renderWorkout(JSON.parse(this.response), true, displayDate.value)
            toggleRequired()
            populate()
        })
    }
}

// New set reps
let newReps = prompt(`New reps count for set ${index + 1}: `, reps)
if (newReps != null && !newReps.match(/^\s+$/) && newReps != "" && newReps != reps) {
    if (!newReps.match(/^\d+$/)) {
        alert("Please enter a valid number for reps performed.")
        return
    } else {
        xhttp.open("POST", "/update/reps")
        xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
        xhttp.send(JSON.stringify({ exercise_name: exercise.exercise_name, set_id: set._id, repsIndex: index, newReps, date: displayDate.value }))
        sessionStorage.exercise_name = exercise.exercise_name
        /*
        sessionStorage.set_weight = set.set_weight.split(/(\d+\.\d{0,2}|\d+)/)[1]
        sessionStorage.set_weight_unit = set.set_weight.split(/(\d+\.\d{0,2}|\d+)/)[2]
        sessionStorage.set_reps = newReps
        
        xhttp.onload(() => {
            renderWorkout(JSON.parse(this.response), true, displayDate.value)
            toggleRequired()
            populate()
        })
    }
}

// New superset exercise name
let newName = prompt("New superset exercise name: ", superset_exercise)
if (newName != null && !newName.match(/^\s+$/) && newName != "" && newName != superset_exercise) {
    xhttp.open("POST", "/update/superset_name")
    xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
    xhttp.send(JSON.stringify({ exercise_name: exercise.exercise_name, set_id: set._id, newName, date: displayDate.value }))
    sessionStorage.exercise_name = exercise.exercise_name
    /*
    sessionStorage.set_weight = set.set_weight.split(/(\d+\.\d{0,2}|\d+)/)[1]
    sessionStorage.set_weight_unit = set.set_weight.split(/(\d+\.\d{0,2}|\d+)/)[2]
    sessionStorage.superset = true
    sessionStorage.superset_exercise = newName
    
    xhttp.onload(() => {
        renderWorkout(JSON.parse(this.response), true, displayDate.value)
        toggleRequired()
        populate()
    })
}

// New superset weight
let newWeight = prompt("New superset weight used: ", superset_weight)
if (newWeight != null && !newWeight.match(/^\s+$/) && newWeight != superset_weight) {
    if (!newWeight.match(/(^(\d+\.\d{0,2}|\d+)(kg|lbs)$)|(^$)/)) {
        alert("Make sure your new weight follows the structure [x]kg/lbs or [x.xx]kg/lbs.")
        return
    } else {
        xhttp.open("POST", "/update/superset_weight")
        xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
        xhttp.send(JSON.stringify({ exercise_name: exercise.exercise_name, set_id: set._id, newWeight, date: displayDate.value }))
        sessionStorage.exercise_name = exercise.exercise_name
        /*
        sessionStorage.set_weight = set.set_weight.split(/(\d+\.\d{0,2}|\d+)/)[1]
        sessionStorage.set_weight_unit = set.set_weight.split(/(\d+\.\d{0,2}|\d+)/)[2]
        sessionStorage.superset_exercise = set.superset_exercise
        sessionStorage.superset_weight = newWeight.split(/(\d+\.\d{0,2}|\d+)/)[1]
        sessionStorage.superset_weight_unit = newWeight.split(/(\d+\.\d{0,2}|\d+)/)[2]
        
        xhttp.onload(() => {
            renderWorkout(JSON.parse(this.response), true, displayDate.value)
            toggleRequired()
            populate()
        })
    }
}

// New superset reps
let newReps = prompt(`New superset reps count for set ${index + 1}: `, reps)
if (newReps != null && !newReps.match(/^\s+$/) && newReps != "" && newReps != reps) {
    if (!newReps.match(/^\d+$/)) {
        alert("Please enter a valid number for reps performed.")
        return
    } else {
        xhttp.open("POST", "/update/superset_reps")
        xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
        xhttp.send(JSON.stringify({ exercise_name: exercise.exercise_name, set_id: set._id, repsIndex: index, newReps, date: displayDate.value }))
        sessionStorage.exercise_name = exercise.exercise_name
        /*
        sessionStorage.set_weight = set.set_weight.split(/(\d+\.\d{0,2}|\d+)/)[1]
        sessionStorage.set_weight_unit = set.set_weight.split(/(\d+\.\d{0,2}|\d+)/)[2]
        sessionStorage.set_reps = newReps
        
        xhttp.onload(() => {
            renderWorkout(JSON.parse(this.response), true, displayDate.value)
            toggleRequired()
            populate()
        })
    }
}

// New set comment
let setIndex = comment.split(": ")[0]
let editedComment = prompt(`New comment for set ${setIndex.split(" ")[1]}: `, comment.split(": ")[1])
if (editedComment != null && !editedComment.match(/^\s+$/) && editedComment != "" && editedComment != comment) {
    editedComment = `${setIndex}: ` + editedComment
    xhttp.open("POST", "/update/set_comments")
    xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
    xhttp.send(JSON.stringify({ exercise_name: exercise.exercise_name, set_id: set._id, commentIndex: index, editedComment, date: displayDate.value }))
    sessionStorage.exercise_name = exercise.exercise_name
    xhttp.onload(() => {
        renderWorkout(JSON.parse(this.response), true, displayDate.value)
        toggleRequired()
        populate()
    })
}
*/