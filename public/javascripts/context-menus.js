const username = document.getElementById("username")

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

// Prevent context menus from overflowing off the screen
const preventOutOfBounds = (contextMenu, pageX) => {
    const { left: scopeOffsetX } = workoutContainer.getBoundingClientRect()

    const scopeX = pageX - scopeOffsetX

    const outOfBoundsX = scopeX + contextMenu.clientWidth > workoutContainer.clientWidth

    if (outOfBoundsX) {
        return scopeOffsetX + workoutContainer.clientWidth - contextMenu.clientWidth
    } else {
        return pageX
    }
}

////////////////////////
//  Exercise options  //
////////////////////////

// New exercise name
const editExerciseName = (exercise_name, date) => {
    $("#exercise-edit").off()
    $("#exercise-edit").click(() => {
        if (username) {
            let newName = prompt("New exercise name: ", exercise_name)
            if (newName != null && !newName.match(/^\s+$/) && newName != "" && newName != exercise_name) {
                xhttp.open("POST", "/update/exercise")
                xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
                xhttp.send(JSON.stringify({ exercise_name, newName, date }))
                xhttp.onreadystatechange = function () {
                    if (xhttp.readyState == 4) {
                            renderWorkout(JSON.parse(this.response), true, date)
                            toggleRequired()
                            populate()
                    }
                }
            }
        } else {
            alert("You need to be logged in to edit workouts.")
        }
    })
}

const deleteExercise = (exercise_name, date) => {
    $("#exercise-delete").off()
    $("#exercise-delete").click(() => {
        if (username) {
            if (confirm("Are you sure you want to delete this exercise?") == true) {
                xhttp.open("POST", "/delete/exercise")
                xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
                xhttp.send(JSON.stringify({ exercise_name, date }))
                xhttp.onreadystatechange = function () {
                    if (xhttp.readyState == 4) {
                        if (this.response.match(/^</) || !this.response) {
                            renderWorkout("not found", true, date)
                        } else {
                            renderWorkout(JSON.parse(this.response), true, date)
                            toggleRequired()
                            populate()
                        }
                    }

                }
            }
        } else {
            alert("You need to be logged in to edit workouts.")
        }
    })
}

////////////////////////////////
//  Exercise comment options  //
////////////////////////////////

// Edit comment
const editExerciseComment = (exercise_name, date, index, comment) => {
    $("#exercise-comment-edit").off()
    $("#exercise-comment-edit").click(() => {
        if (username) {
            let editedComment = prompt("New comment: ", comment)
            if (editedComment != null && !editedComment.match(/^\s+$/) && editedComment != "" && editedComment != comment) {
                xhttp.open("POST", "/update/exercise_comments")
                xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
                xhttp.send(JSON.stringify({ exercise_name, commentIndex: index, editedComment, date }))
                xhttp.onreadystatechange = function () {
                    if (xhttp.readyState == 4) {
                            renderWorkout(JSON.parse(this.response), true, date)
                            toggleRequired()
                            populate()
                    }
                }
            }
        } else {
            alert("You need to be logged in to edit workouts.")
        }
    })
}

const addExerciseComment = (exercise_name, date) => {
    $("#exercise-comment").off()
    $("#exercise-comment").click(() => {
        if (username) {
            let newComment = prompt("New comment: ")
            if (newComment != null && !newComment.match(/^\s+$/) && newComment != "") {
                xhttp.open("POST", "/comments/exercise_comments")
                xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
                xhttp.send(JSON.stringify({ exercise_name, newComment, date }))
                xhttp.onreadystatechange = function () {
                    if (xhttp.readyState == 4) {
                            renderWorkout(JSON.parse(this.response), true, date)
                            toggleRequired()
                            populate()
                    }
                }
            }
        } else {
            alert("You need to be logged in to edit workouts.")
        }
    })
}

// Delete exercise comment
const deleteExerciseComment = (exercise_name, date, index) => {
    $("#exercise-comment-delete").off()
    $("#exercise-comment-delete").click(() => {
        if (username) {
            if (confirm("Are you sure you want to delete this comment?") == true) {
                xhttp.open("POST", "/delete/exercise_comments")
                xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
                xhttp.send(JSON.stringify({ exercise_name, date, index }))
                xhttp.onreadystatechange = function () {
                    if (xhttp.readyState == 4) {
                        if (this.response.match(/^</) || !this.response) {
                            renderWorkout("not found", true, date)
                        } else {
                            renderWorkout(JSON.parse(this.response), true, date)
                            toggleRequired()
                            populate()
                        }
                    }
                }
            }
        } else {
            alert("You need to be logged in to edit workouts.")
        }
    })
}

//////////////////////
//  Weight options  //
//////////////////////

// Edit weight
const editWeight = (exercise_name, date, set_id, set_weight) => {
    $("#weight-edit").off()
    $("#weight-edit").click(() => {
        if (username) {
            let newWeight = prompt("New weight used: ", set_weight)
            if (newWeight != null && !newWeight.match(/^\s+$/) && newWeight != set_weight) {
                if (!newWeight.match(/(^(\d+\.\d{0,2}|\d+)(kg|lbs)$)|(^$)/)) {
                    alert("Make sure your new weight follows the structure [x]kg/lbs or [x.xx]kg/lbs.")
                    return
                } else {
                    xhttp.open("POST", "/update/weight")
                    xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
                    xhttp.send(JSON.stringify({ exercise_name, set_id, newWeight, date }))
                    xhttp.onreadystatechange = function () {
                        if (xhttp.readyState == 4) {
                                renderWorkout(JSON.parse(this.response), true, date)
                                toggleRequired()
                                populate()
                        } else {
                            alert("You need to be logged in to edit workouts.")
                        }
                    }
                }
            }
        }
    })
}

// Delete weight
const deleteWeight = (exercise_name, date, set_id) => {
    $("#weight-delete").off()
    $("#weight-delete").click(() => {
        if (username) {
            if (confirm("Are you sure you want to delete this weight?") == true) {
                xhttp.open("POST", "/delete/weight")
                xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
                xhttp.send(JSON.stringify({ exercise_name, date, set_id }))
                xhttp.onreadystatechange = function () {
                    if (xhttp.readyState == 4) {
                        if (this.response.match(/^</) || !this.response) {
                            renderWorkout("not found", true, date)
                        } else {
                            renderWorkout(JSON.parse(this.response), true, date)
                            toggleRequired()
                            populate()
                        }
                    }
                }
            }
        } else {
            alert("You need to be logged in to edit workouts.")
        }
    })
}

///////////////////
//  Set options  //
///////////////////

// Edit reps
const editReps = (exercise_name, date, set_id, repsIndex, reps) => {
    $("#reps-edit").off()
    $("#reps-edit").click(() => {
        if (username) {
            let newReps = prompt(`New reps count for set ${repsIndex + 1}: `, reps)
            if (newReps != null && !newReps.match(/^\s+$/) && newReps != "" && newReps != reps) {
                if (!newReps.match(/^\d+$/)) {
                    alert("Please enter a valid number for reps performed.")
                    return
                } else {
                    xhttp.open("POST", "/update/reps")
                    xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
                    xhttp.send(JSON.stringify({ exercise_name, set_id, repsIndex, newReps, date }))
                    xhttp.onreadystatechange = function () {
                        if (xhttp.readyState == 4) {
                            renderWorkout(JSON.parse(this.response), true, date)
                            toggleRequired()
                            populate()
                        }
                    }
                }
            }
        } else {
            alert("You need to be logged in to edit workouts.")
        }
    })
}

// Delete set
const deleteReps = (exercise_name, date, comments, set_id, repsIndex) => {
    $("#reps-delete").off()
    $("#reps-delete").click(() => {
        if (username) {
            // find the comment for the set
            if (confirm(`Are you sure you want to delete set ${repsIndex + 1}?`) == true) {
                let newComments = []
                comments.forEach(comment => { if (!comment.match(`Set ${repsIndex + 1}: `)) { newComments.push(comment) } })
                newComments.forEach((comment, index) => {
                    if (parseInt(comment.split(": ")[0].split(" ")[1]) > (repsIndex + 1)) {
                        newComments[index] = `Set ${parseInt(comment.split(": ")[0].split(" ")[1]) - 1}: ${comment.split(": ")[1]}`
                    }
                })
                xhttp.open("POST", "/delete/reps")
                xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
                xhttp.send(JSON.stringify({ exercise_name, date, set_id, repsIndex, newComments }))
                xhttp.onreadystatechange = function () {
                    if (xhttp.readyState == 4) {
                        if (this.response.match(/^</) || !this.response) {
                            renderWorkout("not found", true, date)
                        } else {
                            renderWorkout(JSON.parse(this.response), true, date)
                            toggleRequired()
                            populate()
                        }
                    }
                }
            }
        } else {
            alert("You need to be logged in to edit workouts.")
        }
    })
}

///////////////////////////
//  Set comment options  //
///////////////////////////

// Edit set comment
const editSetComment = (exercise_name, date, set_id, commentIndex, comment) => {
    $("#set-comment-edit").off()
    $("#set-comment-edit").click(() => {
        if (username) {
            let setIndex = comment.split(": ")[0]
            let editedComment = prompt(`New comment for set ${setIndex.split(" ")[1]}: `, comment.split(": ")[1])
            if (editedComment != null && !editedComment.match(/^\s+$/) && editedComment != "" && editedComment != comment) {
                editedComment = `${setIndex}: ${editedComment}`
                xhttp.open("POST", "/update/set_comments")
                xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
                xhttp.send(JSON.stringify({ exercise_name, set_id, commentIndex, editedComment, date }))
                xhttp.onreadystatechange = function () {
                    if (xhttp.readyState == 4) {
                            renderWorkout(JSON.parse(this.response), true, date)
                            toggleRequired()
                            populate()
                    }
                }
            }
        } else {
            alert("You need to be logged in to edit workouts.")
        }
    })
}

// New set comment
const addSetComment = (exercise_name, date, set_id, setIndex) => {
    $("#reps-comment").off()
    $("#reps-comment").click(() => {
        if (username) {
            let newComment = prompt(`New comment for set ${setIndex + 1}: `)
            if (newComment != null && !newComment.match(/^\s+$/) && newComment != "") {
                newComment = `Set ${setIndex + 1}: ${newComment}`
                xhttp.open("POST", "/comments/set_comments")
                xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
                xhttp.send(JSON.stringify({ exercise_name, newComment, date, set_id }))
                xhttp.onreadystatechange = function () {
                    if (xhttp.readyState == 4) {
                            renderWorkout(JSON.parse(this.response), true, date)
                            toggleRequired()
                            populate()
                    }
                }
            }
        } else {
            alert("You need to be logged in to edit workouts.")
        }
    })
}

// Delete set comment
const deleteSetComment = (exercise_name, date, set_id, comment) => {
    $("#set-comment-delete").off()
    $("#set-comment-delete").click(() => {
        if (username) {
            if (confirm("Are you sure you want to delete this comment?") == true) {
                xhttp.open("POST", "/delete/set_comments")
                xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
                xhttp.send(JSON.stringify({ exercise_name, date, set_id, comment }))
                xhttp.onreadystatechange = function () {
                    if (xhttp.readyState == 4) {
                            renderWorkout(JSON.parse(this.response), true, date)
                            toggleRequired()
                            populate()
                    }
                }
            }
        } else {
            alert("You need to be logged in to edit workouts.")
        }
    })
}

////////////////////////
//  Superset options  //
////////////////////////

// Edit superset exercise
const editSupersetExercise = (exercise_name, date, set_id, superset_exercise) => {
    $("#superset-exercise-edit").off()
    $("#superset-exercise-edit").click(() => {
        if (username) {
            let newName = prompt("New superset exercise name: ", superset_exercise)
            if (newName != null && !newName.match(/^\s+$/) && newName != "" && newName != superset_exercise) {
                xhttp.open("POST", "/update/superset_name")
                xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
                xhttp.send(JSON.stringify({ exercise_name, set_id, newName, date }))
                xhttp.onreadystatechange = function () {
                    if (xhttp.readyState == 4) {
                            renderWorkout(JSON.parse(this.response), true, date)
                            toggleRequired()
                            populate()
                    }
                }
            }
        } else {
            alert("You need to be logged in to edit workouts.")
        }
    })
}

// Edit superset weight
const editSupersetWeight = (exercise_name, date, set_id, superset_weight) => {
    $("#superset-weight-edit").off()
    $("#superset-weight-edit").click(() => {
        if (username) {
            let newWeight = prompt("New superset weight used: ", superset_weight)
            if (newWeight != null && !newWeight.match(/^\s+$/) && newWeight != superset_weight) {
                if (!newWeight.match(/(^(\d+\.\d{0,2}|\d+)(kg|lbs)$)|(^$)/)) {
                    alert("Make sure your new weight follows the structure [x]kg/lbs or [x.xx]kg/lbs.")
                    return
                } else {
                    xhttp.open("POST", "/update/superset_weight")
                    xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
                    xhttp.send(JSON.stringify({ exercise_name, set_id, newWeight, date }))
                    xhttp.onreadystatechange = function () {
                        if (xhttp.readyState == 4) {
                            renderWorkout(JSON.parse(this.response), true, date)
                            toggleRequired()
                            populate()
                        }
                    }
                }
            }
        } else {
            alert("You need to be logged in to edit workouts.")
        }
    })
}

// Delete superset
const deleteSuperset = (exercise_name, date, set_id) => {
    $("#superset-delete").off()
    $("#superset-delete").click(() => {
        if (username) {
            if (confirm("Are you sure you want to delete this superset?") == true) {
                xhttp.open("POST", "/delete/superset")
                xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
                xhttp.send(JSON.stringify({ exercise_name, date, set_id }))
                xhttp.onreadystatechange = function () {
                    if (xhttp.readyState == 4) {
                            renderWorkout(JSON.parse(this.response), true, date)
                            toggleRequired()
                            populate()
                    }
                }
            }
        } else {
            alert("You need to be logged in to edit workouts.")
        }
    })
}

/////////////////////////////
//  Superset reps options  //
/////////////////////////////

// Edit superset reps
const editSupersetReps = (exercise_name, date, set_id, repsIndex, reps) => {
    $("#superset-reps-edit").off()
    $("#superset-reps-edit").click(() => {
        if (username) {
            let newReps = prompt(`New superset reps count for set ${repsIndex + 1}: `, reps)
            if (newReps != null && !newReps.match(/^\s+$/) && newReps != "" && newReps != reps) {
                if (!newReps.match(/^\d+$/)) {
                    alert("Please enter a valid number for reps performed.")
                    return
                } else {
                    xhttp.open("POST", "/update/superset_reps")
                    xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8")
                    xhttp.send(JSON.stringify({ exercise_name, set_id, repsIndex, newReps, date }))
                    xhttp.onreadystatechange = function () {
                        if (xhttp.readyState == 4) {
                            renderWorkout(JSON.parse(this.response), true, date)
                            toggleRequired()
                            populate()
                        }
                    }
                }
            }
        } else {
            alert("You need to be logged in to edit workouts.")
        }
    })
}