const inputDate = document.getElementById("workout-input")
const inputExercise = document.getElementById("exercise-input")
const inputExerciseComment = document.getElementById("exercise-comment-input")
const inputWeight = document.getElementById("weight-input")
const inputWeightUnit = document.getElementById("weight-unit")
const inputWeightKg = document.getElementById("weight-kg")
const inputWeightLbs = document.getElementById("weight-lbs")
const inputReps = document.getElementById("reps-input")
const inputSetComment = document.getElementById("set-comment-input")
const supersetCheckbox = document.getElementById("superset-input")
const inputSupersetExercise = document.getElementById("superset-exercise-input")
const inputSupersetWeight = document.getElementById("superset-weight-input")
const inputSupersetWeightUnit = document.getElementById("superset-weight-unit")
const inputSupersetWeightKg = document.getElementById("superset-weight-kg")
const inputSupersetWeightLbs = document.getElementById("superset-weight-lbs")
const inputSupersetReps = document.getElementById("superset-reps-input")

$("#superset-input").nextAll().slideUp(0)

$("#superset-input").click(function () {
    $header = $(this)
    $content = $header.nextAll()
    $content.slideToggle(500, toggleRequired())
})
// Toggles the superset exercise name to be required or not depending on if the checkbox is checked
const toggleRequired = () => {
    if (supersetCheckbox.checked) {
        inputSupersetExercise.setAttribute("required", "true")
    } else {
        inputSupersetExercise.removeAttribute("required")
        // Removes values for superset details when superset is unchecked
        inputSupersetExercise.value = ""
        inputSupersetWeight.value = ""
        inputSupersetWeightUnit.value = "kg"
        inputSupersetReps.value = ""
    }
}