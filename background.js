let intervalId

async function fetchAzkar() {
    const response = await fetch(chrome.runtime.getURL('azkar.txt'))
    const text = await response.text()
    const azkar = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    return azkar
}

function createNotification(text) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon16.png',
        title: 'فَذَكِّرْ',
        message: text
    })
}

async function startNotifications(interval) {
    clearInterval(intervalId)
    const azkar = await fetchAzkar()
    intervalId = setInterval(() => {
        const randomAzkar = azkar[Math.floor(Math.random() * azkar.length)]
        createNotification(randomAzkar)
    }, interval)
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(['enabled', 'interval'], (data) => {
        if (data.enabled) {
            startNotifications(data.interval || 10000) 
        }
    })
})

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && (changes.enabled || changes.interval)) {
        if (changes.enabled) {
            if (changes.enabled.newValue) {
                chrome.storage.sync.get('interval', (data) => {
                    startNotifications(data.interval || 10000)
                })
            } else {
                clearInterval(intervalId)
            }
        } else if (changes.interval) {
            chrome.storage.sync.get('enabled', (data) => {
                if (data.enabled) {
                    startNotifications(changes.interval.newValue)
                }
            })
        }
    }
})