// Hides context menus if clicked outside
const hideAllMenus = () => {
    $("#exercise-menu").hide().offset({ top: 0, left: 0 })
    $("#exercise-comments-menu").hide().offset({ top: 0, left: 0 })
    $("#weight-menu").hide().offset({ top: 0, left: 0 })
    $("#set-menu").hide().offset({ top: 0, left: 0 })
    $("#set-comments-menu").hide().offset({ top: 0, left: 0 })
    $("#superset-menu").hide().offset({ top: 0, left: 0 })
    $("#superset-reps-menu").hide().offset({ top: 0, left: 0 })
}
hideAllMenus()

document.addEventListener("click", (e) => {
    const allMenus = document.querySelectorAll(".context-menu")
    allMenus.forEach(menu => {
        if (e.target.offsetParent != menu) {
            hideAllMenus()
        }
    })
})

/*
const hideOnClick = (menu) => {
    menu.style.top = "0px"
    menu.style.left = "0px"
    menu.style.visibility = "hidden"
}*/

// Exercise options

// New exercise name
const editExerciseName = (exercise_name, date) => {
    $("#exercise-edit").off()
    $("#exercise-edit").click(() => {
        // Hide exercise context menu
        hideAllMenus()

        let newName = prompt("New exercise name: ", exercise_name)
        if (newName != null && !newName.match(/^\s+$/) && newName != "" && newName != exercise_name) {
            xhttp.open("POST", "/update/exercise")
            xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
            xhttp.send(JSON.stringify({ exercise_name, newName, date }))
            sessionStorage.exercise_name = newName
            xhttp.onload(() => {
                console.log("im here")
                renderWorkout(JSON.parse(this.response), true, date)
                toggleRequired()
                populate()
            })
        }
    })
}

const addExerciseComment = (exercise_name, date) => {

}

const deleteExercise = (exercise_name, date) => {

}

// Comment options

// Edit comment
const editExerciseComment = (exercise_name, date, index, comment) => {
    $("#exercise-comment-edit").off()
    $("#exercise-comment-edit").click(() => {
        hideAllMenus()

        let editedComment = prompt("New comment: ", comment)
        if (editedComment != null && !editedComment.match(/^\s+$/) && editedComment != "" && editedComment != comment) {
            xhttp.open("POST", "/update/exercise_comments")
            xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
            xhttp.send(JSON.stringify({ exercise_name, commentIndex: index, editedComment, date }))
            sessionStorage.exercise_name = exercise_name
            xhttp.onload(() => {
                renderWorkout(JSON.parse(this.response), true, date)
                toggleRequired()
                populate()
            })
        }
    })
}/*

// Delete comment
const  = (exercise_name, date, ) => {

}
*/
// Weight options

// Edit weight
const editWeight = (exercise_name, date, set_id, set_weight) => {
    $("#weight-edit").off()
    $("#weight-edit").click(() => {
        hideAllMenus()

        let newWeight = prompt("New weight used: ", set_weight)
        if (newWeight != null && !newWeight.match(/^\s+$/) && newWeight != set_weight) {
            if (!newWeight.match(/(^(\d+\.\d{0,2}|\d+)(kg|lbs)$)|(^$)/)) {
                console.log(newWeight)
                alert("Make sure your new weight follows the structure [x]kg/lbs or [x.xx]kg/lbs.")
                return
            } else {
                xhttp.open("POST", "/update/weight")
                xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
                xhttp.send(JSON.stringify({ exercise_name, set_id, newWeight, date }))
                sessionStorage.exercise_name = exercise_name
                xhttp.onload(() => {
                    renderWorkout(JSON.parse(this.response), true, date)
                    toggleRequired()
                    populate()
                })
            }
        }
    })
}/*

// Delete weight
const  = (exercise_name, date, ) => {

}*/

// Set options

// Edit reps
const editReps = (exercise_name, date, set_id, repsIndex, reps) => {
    $("#reps-edit").off()
    $("#reps-edit").click(() => {
        let newReps = prompt(`New reps count for set ${repsIndex + 1}: `, reps)
        if (newReps != null && !newReps.match(/^\s+$/) && newReps != "" && newReps != reps) {
            if (!newReps.match(/^\d+$/)) {
                alert("Please enter a valid number for reps performed.")
                return
            } else {
                xhttp.open("POST", "/update/reps")
                xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
                xhttp.send(JSON.stringify({ exercise_name, set_id, repsIndex, newReps, date }))
                sessionStorage.exercise_name = exercise_name
                xhttp.onload(() => {
                    renderWorkout(JSON.parse(this.response), true, date)
                    toggleRequired()
                    populate()
                })
            }
        }
    })
}
/*
// New set comment
const  = (exercise_name, date, ) => {

}

// Delete set
const  = (exercise_name, date, ) => {

}

// Set comments options

// Edit set comment
const  = (exercise_name, date, ) => {

}

// Delete set comment
const  = (exercise_name, date, ) => {

}

// Superset options

// Edit superset exercise
const  = (exercise_name, date, ) => {

}

// Edit superset weight
const  = (exercise_name, date, ) => {

}

// Delete superset
const  = (exercise_name, date, ) => {

}

// Superset reps options

// Edit superset reps
const  = (exercise_name, date, ) => {

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