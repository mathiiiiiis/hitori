import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCharacterStore = defineStore('character', () => {
  //identity
  const name = ref('')
  const birthday = ref('')
  const catchphrase = ref('')

  //personality (0-100)
  const personality = ref({
    patience: 50,
    energyLevel: 50,
    pickiness: 50,
    sociability: 50,
    optimism: 50,
  })

  //needs (0-100)
  const needs = ref({
    hunger: 100,
    energy: 100,
    happiness: 100,
    hygiene: 100,
    fun: 100,
    health: 100,
  })

  //mood: derived
  const mood = computed(() => {
    const n = needs.value
    const p = personality.value

    if (n.health < 20) return 'sick'
    if (n.energy  < 10) return 'exhausted'
    if (n.energy  < 30) return 'tired'
    if (n.hunger < 20) return 'starving'
    if (n.fun < 20 && n.happiness < 30) return 'bored'
    if (n.happiness < 20) return 'sad'

    //optimism helps recover mood faster
    const avg = (n.hunger + n.energy + n.happiness + n.hygiene + n.fun + n.health) / 6
    const boosted = avg + (p.optimism - 50) * 0.2

    if (boosted > 80) return 'Happy'
    if (boosted > 50) return 'content'
    return 'neutral'
  })

  //activity
  const activity = ref('idle') /// idle, sleeping, napping, eating, playing, etc.

  //progress
  const level = ref(1)
  const xp = ref(0)
  const inventory = ref([])
  const room = ref({})
  const clothing = ref (null)
  const favoriteFood = ref(null)
  const worstFood = ref(null)
  const problemsSolved = ref(0)

  //events
  const currentProblem = ref(null)
  const dreamFlags = ref([])
  const eventHistory = ref([])

  //clock. yes real-time
  let tickInterval = null

  function getDecayRate(base, personalityValue) {
    //higher personality value = slower decay
    return base * (1 + (50 - personalityValue) / 100)
  }

  function tick() {
    const n = needs.value
    const p = personality.value
    const hour = new Date().getHours()
    const isNight = hour >= 22 || hour < 7

    //sleeping logic
    if (activity.value === 'sleeping' || activity.value === 'napping') {
      n.energy = Math.min(100, n.energy + 3.5)
      n.hunger = Math.max(0, n.hunger - 0.1)
      n.hygiene = Math.max(0, n.hygiene - 0.05)
      if (n.energy >= 100) {
        activity.value = 'idle'
      }
      return
    }

    //auto sleep
    if (n.energy <= 0) {
      activity.value = isNight ? 'sleeping' : 'napping' //when night sleep, when day nap
      return
    }

    //decay rates oer tick (every ~5s)
    n.hunger = Math.max(0, n.hunger - getDecayRate(0.3, p.patience))
    n.energy = Math.max(0, n.energy - getDecayRate(0.2, p.energyLevel))
    n.hygiene = Math.max(0, n.hygiene - getDecayRate(0.15, 50))
    n.fun = Math.max(0, n.fun - getDecayRate(0.25, 50))

    //happiness drifts toward average of other needs
    const avg = (n.hunger + n.energy + n.hygiene + n.fun + n.health) / 5
    const drift = (avg - n.happiness) * 0.05
    n.happiness = Math.max(0, Math.min(100, n.happiness + drift))

    //health drops if other needs are very low
    const lowCount = [n.hunger, n.energy, n.hygiene].filter(v => v < 20).length
    if (lowCount >= 2) {
      n.health = Math.max(0, n.health - 0.3)
    } else if (n.health < 100 && lowCount === 0) {
      n.health = Math.min(100, n.health + 0.1)
    }

    //night time = faster energy drain
    if (isNight) {
      n.energy = Math.max(0, n.energy - 0.15)
    }
  }

  function startTicking() {
    if (tickInterval) return
    tickInterval = setInterval(tick, 5000)
  }

  function stopTicking() {
    clearInterval(tickInterval)
    tickInterval = null
  }

  function isAsleep() {
    return activity.value === 'sleeping' || activity.value === 'napping'
  }

  //action
  function feed(food) {
    if (isAsleep()) return
    const n = needs.value
    const p = personality.value
    const bonus = food === favoriteFood.value ? 1.5 : food === worstFood.value ? 0.3 : 1
    const picky = p.pickiness / 100

    n.hunger = Math.min(100, n.hunger + 30 * bonus)
    n.happiness = Math.min(100, n.happiness + (bonus > 1 ? 10 : bonus < 1 ? -5 * picky : 2))
    addXP(5)
  }

  function play(_game) {
    if (isAsleep()) return
    const n = needs.value
    n.fun = Math.min(100, n.fun + 25)
    n.energy = Math.max(0, n.energy - 0.5)
    n.happiness = Math.min(100, n.happiness + 10)
    addXP(10)
  }

  function bathe() {
    if (isAsleep()) return
    needs.value.hygiene = Math.min(100, needs.value.hygiene + 40)
    addXP(3)
  }

  function addXP(amount) {
    xp.value += amount
    const threshold = level.value * 50
    if (xp.value >= threshold) {
      xp.value -= threshold
      level.value++
    }
  }

  function solveProblem() {
    currentProblem.value = null
    problemsSolved.value++
    needs.value.happiness = Math.min(100, needs.value.happiness + 15)
    addXP(20)
  }

  //serialize for save
  function toJSON() {
    return {
      name: name.value,
      birthday: birthday.value,
      catchphrase: catchphrase.value,
      personality: personality.value,
      needs: needs.value,
      activity: activity.value,
      level: level.value,
      xp: xp.value,
      inventory: inventory.value,
      room: room.value,
      clothing: clothing.value,
      favoriteFood: favoriteFood.value,
      worstFood: worstFood.value,
      problemsSolved: problemsSolved.value,
      currentProblem: currentProblem.value,
      dreamFlags: dreamFlags.value,
      eventHistory: eventHistory.value,
      savedAt: Date.now(),
    }
  }

  function loadFromSave(data) {
    if (!data || !data.name) return

    name.value = data.name
    birthday.value = data.birthday || ''
    catchphrase.value = data.catchphrase || ''
    personality.value = { ...personality.value, ...data.personality }
    needs.value = { ...needs.value, ...data.needs }
    activity.value = { ...needs.value, ...data.needs }
    activity.value = data.activity || 'idle'
    level.value = data.level || 1
    xp.value = data.xp || 0
    inventory.value = data.inventory || []
    room.value = data.room || {}
    clothing.value = data.clothing || null
    favoriteFood.value = data.favoriteFood || null
    worstFood.value = data.worstFood || null
    problemsSolved.value = data.problemsSolved || 0
    currentProblem.value = data.currentProblem || null
    dreamFlags.value = data.dreamFlags || []
    eventHistory.value = data.eventHistory || []

    //simulate time passed while away
    if (data.savedAt) {
      const elapsed = (Date.now() - data.savedAt) / 1000
      const missedTicks = Math.floor(elapsed / 5)
      const capped = Math.min(missedTicks, 720) //cap at 1 hour of decay
      for (let i = 0; i < capped; i++) tick()
    }
  }

  return {
    name, birthday, catchphrase, personality,
    needs, mood, activity,
    level, xp, inventory, room, clothing,
    favoriteFood, worstFood, problemsSolved,
    currentProblem, dreamFlags, eventHistory,
    startTicking, stopTicking, isAsleep,
    feed, play, bathe, solveProblem, addXP,
    toJSON, loadFromSave,
  }
})
