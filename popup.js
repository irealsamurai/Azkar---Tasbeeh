document.addEventListener('DOMContentLoaded', () => {
    const enableNotifications = document.getElementById('enableNotifications')
    const notificationInterval = document.getElementById('notificationInterval')
    const saveSettings = document.getElementById('saveSettings')
    const notification = document.getElementById('notification')
    const tasbeehCount = document.getElementById('tasbeeh-count')
    const tasbeehButton = document.getElementById('tasbeeh-button')
    const resetCounter = document.getElementById('reset-counter')
    const tasbeehMessage = document.getElementById('tasbeeh-message')

    if (saveSettings) {
        chrome.storage.sync.get(['enabled', 'interval', 'tasbeehCount'], (data) => {
            enableNotifications.checked = data.enabled || false
            notificationInterval.value = (data.interval / 1000) || 10
            tasbeehCount.textContent = data.tasbeehCount || 0
            if (data.tasbeehCount === 0) {
                tasbeehMessage.textContent = 'فَسَبِّحْ بِحَمْدِ رَبِّكَ'
            } else {
                tasbeehMessage.textContent = 'فَسَبِّحْ بِحَمْدِ رَبِّكَ'
            }
        })

        saveSettings.addEventListener('click', () => {
            const enabled = enableNotifications.checked
            const interval = parseInt(notificationInterval.value) * 1000

            chrome.storage.sync.set({ enabled, interval }, () => {
                if (notification) {
                    notification.style.display = 'block'
                    setTimeout(() => {
                        if (notification) {
                            notification.style.display = 'none'
                        }
                    }, 2000)
                }
            })
        })
    }


    document.getElementById('notificationInterval').addEventListener('input', function() {
        const seconds = parseInt(this.value)
        const messageDiv = document.getElementById('minutesMessage')
    
        if (isNaN(seconds) || seconds < 60) {
            messageDiv.textContent = ''
        } else {
            const minutes = (seconds / 60).toFixed(1) 
            messageDiv.textContent = `${seconds} ثانية يعادل ${minutes} دقائق.`
        }
    })
    
    document.getElementById('saveSettings').addEventListener('click', function() {
        const interval = parseInt(document.getElementById('notificationInterval').value) * 1000
        const enabled = document.getElementById('enableNotifications').checked
        chrome.storage.sync.set({ interval, enabled }, function() {
            const notification = document.getElementById('notification')
            notification.style.display = 'block'
            setTimeout(() => {
                notification.style.display = 'none'
            }, 2000)
        })
    })
    
    chrome.storage.sync.get(['enabled', 'interval'], function(data) {
        if (data.enabled !== undefined) {
            document.getElementById('enableNotifications').checked = data.enabled
        }
        if (data.interval !== undefined) {
            document.getElementById('notificationInterval').value = data.interval / 1000
        }
    })
    

    if (tasbeehButton && resetCounter) {
        tasbeehButton.addEventListener('click', () => {
            let count = parseInt(tasbeehCount.textContent)
            count += 1
            tasbeehCount.textContent = count
            chrome.storage.sync.set({ tasbeehCount: count })
            if (count > 0) {
                tasbeehMessage.textContent = 'فَسَبِّحْ بِحَمْدِ رَبِّكَ'
            }
        })

        resetCounter.addEventListener('click', () => {
            tasbeehCount.textContent = 0
            chrome.storage.sync.set({ tasbeehCount: 0 })
            tasbeehMessage.textContent = 'فَسَبِّحْ بِحَمْدِ رَبِّكَ'
        })
    }
})
