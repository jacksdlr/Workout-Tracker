const supersetCheckDiv = document.querySelector("#superset-check")
const supersetCheckbox = document.querySelector("#superset-input")
const supersetInputContainers = document.querySelectorAll(".superset-input-container")
const supersetExercise = document.getElementById("superset-exercise-input")
supersetCheckbox.addEventListener("change", () => {
    if (supersetCheckbox.checked) {
        supersetInputContainers.forEach((container) => {
            container.style.visibility = "visible"
            container.style.display = "block"
        })
        supersetExercise.setAttribute("required", "true")
    } else {
        supersetInputContainers.forEach((container) => {
            container.style.visibility = "hidden"
            container.style.display = "none"
        })
        supersetExercise.removeAttribute("required")
    }
})

const submitButton = document.getElementById("submit-button")
const exerciseCommentInput = document.getElementById("exercise-comment-input")
const setCommentInput = document.getElementById("set-comment-input")
submitButton.addEventListener("click", () => {
    setTimeout(() => { exerciseCommentInput.value = ""; setCommentInput.value = "" }, 250)
})