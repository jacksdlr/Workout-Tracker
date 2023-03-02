const supersetCheckbox = document.querySelector("#superset-input")
// Checks for changes in the superset checkbox
supersetCheckbox.addEventListener("change", () => {
    const supersetInputContainers = document.querySelectorAll(".superset-input-container")
    const supersetExercise = document.getElementById("superset-exercise-input")
    // If superset is selected, the respective inputs are marked as visible and the exercise name is now required
    if (supersetCheckbox.checked) {
        supersetInputContainers.forEach((container) => {
            container.style.visibility = "visible"
            container.style.display = "block"
        })
        supersetExercise.setAttribute("required", "true")
    // If it is unselected it resets the inputs to again be hidden, and exercise name is no longer required to submit the form
    } else {
        supersetInputContainers.forEach((container) => {
            container.style.visibility = "hidden"
            container.style.display = "none"
        })
        supersetExercise.removeAttribute("required")
    }
})

// This function runs after an XMLHttpRequest in /workout-render.js receives data so that if the submit button is clicked but required fields were not filled it will not empty out the inputs
const resetComments = () => {
    const exerciseCommentInput = document.getElementById("exercise-comment-input")
    const setCommentInput = document.getElementById("set-comment-input")
    exerciseCommentInput.value = "";
    setCommentInput.value = "";
}