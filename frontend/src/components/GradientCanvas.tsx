import { useEffect } from 'react'
import { Gradient } from './Gradient'



const GradientCanvas = () => {

    useEffect(() => {
        // Create your instance
        const gradient = new Gradient()

        // Call `initGradient` with the selector to your canvas
        gradient.initGradient('#gradient-canvas')
    }, [])

    return <canvas id="gradient-canvas" data-transition-in />
}

export default GradientCanvas;