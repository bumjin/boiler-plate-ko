import React, {useEffect} from 'react'
import axios from 'axios'

function LandingPage() {
    useEffect(() => {
        axios.get('http://172.19.20.125:5000/api/hello')
        .then(response => console.log(response.data))
    }, [])

    return (
        <div>
            LandingPage
        </div>
    )
}

export default LandingPage
