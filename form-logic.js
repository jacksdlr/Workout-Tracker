const form = document.querySelector(".form")
const supersetCheckbox = document.querySelector("#superset-input")
supersetCheckbox.addEventListener("change", () => {
    if (supersetCheckbox.checked) {
        // superset exercise input
        const supersetExercise = document.createElement("div")
        supersetExercise.classList.add("superset-input-container")

        const supersetExerciseLabel = document.createElement("label")
        supersetExerciseLabel.setAttribute("for", "superset-exercise-input")
        supersetExerciseLabel.insertAdjacentText("afterbegin", "Exercise: ")

        const supersetExerciseInput = document.createElement("input")
        supersetExerciseInput.setAttribute("type", "text")
        supersetExerciseInput.setAttribute("name", "superset-exercise-name")
        supersetExerciseInput.setAttribute("id", "superset-exercise-input")

        supersetExercise.appendChild(supersetExerciseLabel)
        supersetExercise.appendChild(supersetExerciseInput)

        form.appendChild(supersetExercise)
        
        // superset weight input
        const supersetWeight = document.createElement("div")
        supersetWeight.classList.add("superset-input-container")

        const supersetWeightLabel = document.createElement("label")
        supersetWeightLabel.setAttribute("for", "superset-weight-input")
        supersetWeightLabel.insertAdjacentText("afterbegin", "Weight used: ")

        const supersetWeightInput = document.createElement("input")
        supersetWeightInput.setAttribute("type", "text")
        supersetWeightInput.setAttribute("name", "superset-weight-used")
        supersetWeightInput.setAttribute("id", "superset-weight-input")

        supersetWeight.appendChild(supersetWeightLabel)
        supersetWeight.appendChild(supersetWeightInput)

        form.appendChild(supersetWeight)

        // superset reps input
        const supersetReps = document.createElement("div")
        supersetReps.classList.add("superset-input-container")

        const supersetRepsLabel = document.createElement("label")
        supersetRepsLabel.setAttribute("for", "superset-reps-input")
        supersetRepsLabel.insertAdjacentText("afterbegin", "Repetitions: ")

        const supersetRepsInput = document.createElement("input")
        supersetRepsInput.setAttribute("type", "number")
        supersetRepsInput.setAttribute("name", "superset-reps-performed")
        supersetRepsInput.setAttribute("id", "superset-reps-input")

        supersetReps.appendChild(supersetRepsLabel)
        supersetReps.appendChild(supersetRepsInput)

        form.appendChild(supersetReps)
        
        
        
        
        
    } else {
        const lastSuperset = document.querySelectorAll(".superset-input-container")
        lastSuperset.forEach((superset) => {
            superset.remove()
        })
    }
})