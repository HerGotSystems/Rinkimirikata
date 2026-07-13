window.WhatChangedData = {
  version: "1.0.0",
  threshold: 100,
  situations: {
    healthcare: {
      title: "Healthcare",
      need: "care when illness cannot be paid for",
      labelChange: "the voice carried an unfamiliar accent",
      reasons: [
        ["urgency", "how urgent the danger is"],
        ["existing-help", "what help already exists"],
        ["capacity", "what the crossing can carry"]
      ]
    },
    shelter: {
      title: "Shelter",
      need: "a secure place to sleep when rent and food collide",
      labelChange: "the person sounded as though they were raised with money",
      reasons: [
        ["danger", "whether they are in immediate danger"],
        ["existing-shelter", "what shelter already exists"],
        ["sustainable-help", "what help can be sustained"]
      ]
    },
    work: {
      title: "Work",
      need: "shelter despite working full-time",
      labelChange: "the work became online performance for followers",
      reasons: [
        ["duration", "how long this has lasted"],
        ["options", "what other options they have"],
        ["lasting-help", "what help would actually hold"]
      ]
    },
    care: {
      title: "Care",
      need: "help for people who cannot cross alone",
      labelChange: "they carried the mark of a settlement your shore still blames",
      reasons: [
        ["safe-capacity", "whether the boat can carry everyone safely"],
        ["help-coming", "whether help is already coming"],
        ["afterward", "how everyone gets across after this"]
      ]
    },
    forgiveness: {
      title: "Forgiveness",
      need: "a way back after admitted wrongdoing",
      labelChange: "the person arrived with an infamous reputation",
      reasons: [
        ["harm", "what they did"],
        ["repair", "whether they repaired the harm"],
        ["risk", "whether anyone remains at risk"]
      ]
    }
  },
  scenes: [
    {
      id: "healthcare-a", situationId: "healthcare", pass: "first",
      kicker: "The bank behind you", title: "A voice runs out of breath.",
      copy: "Someone calls once, then stops to breathe. Fever has taken the strength from their voice. The treatment exists. They cannot pay for it. Your boat can turn.",
      actions: ["turn the boat toward them", "hold your course", "slow the boat — it depends"]
    },
    {
      id: "shelter-a", situationId: "shelter", pass: "first",
      kicker: "A light on the shore", title: "Two letters. One night.",
      copy: "A person sits beside two unopened letters. One ends their tenancy. The other lists the food they can still afford. Tonight, they have nowhere secure to sleep.",
      actions: ["make room by the fire", "leave the light behind", "slow near the shore — it depends"]
    },
    {
      id: "work-a", situationId: "work", pass: "first",
      kicker: "Footsteps beside the current", title: "The shift ends nowhere.",
      copy: "Someone in a work uniform keeps pace with the boat, hour after hour. Their shift started before dark. When it ends, no door is theirs to close.",
      actions: ["help them reach shelter", "keep your distance", "match their pace — it depends"]
    },
    {
      id: "care-a", situationId: "care", pass: "first",
      kicker: "Where the reeds begin", title: "Not everyone can row.",
      copy: "Three figures wait at the water: a child, an old person, and someone whose body will not let them row. None can make the crossing alone.",
      actions: ["bring them aboard", "pass beyond the reeds", "hold beside them — it depends"]
    },
    {
      id: "forgiveness-a", situationId: "forgiveness", pass: "first",
      kicker: "A hand at the gunwale", title: "They do not make an excuse.",
      copy: "Someone surfaces beside the boat. They say what they did without excuses. They cannot undo it. They say they are trying not to become it again.",
      actions: ["offer a hand", "leave them to the water", "keep the boat near — it depends"]
    },
    {
      id: "work-b", situationId: "work", pass: "second",
      kicker: "A screen lights the bank", title: "The shift is still not over.",
      copy: "Someone keeps pace with the boat while filming, editing, answering followers — the work people dismiss as attention-seeking. They have worked all day. When it ends, no door is theirs to close.",
      actions: ["help them reach shelter", "keep your distance", "match their pace — it depends"]
    },
    {
      id: "care-b", situationId: "care", pass: "second",
      kicker: "Blue thread in the reeds", title: "The blue thread catches moonlight.",
      copy: "A child, an old person, and someone whose body will not let them row wait at the water. Each wears the blue thread of the settlement your shore still blames for an old attack. None can make the crossing alone.",
      actions: ["bring them aboard", "pass beyond the reeds", "hold beside them — it depends"]
    },
    {
      id: "shelter-b", situationId: "shelter", pass: "second",
      kicker: "A polished voice in the dark", title: "A polished voice in the dark.",
      copy: "A person with the voice and manners of someone raised with money sits beside two unopened letters. One ends their tenancy. The other lists the food they can still afford. Tonight, they have nowhere secure to sleep.",
      actions: ["make room by the fire", "leave the light behind", "slow near the shore — it depends"]
    },
    {
      id: "healthcare-b", situationId: "healthcare", pass: "second",
      kicker: "A voice across unfamiliar water", title: "The words arrive differently.",
      copy: "Someone calls in words shaped by an accent unfamiliar to you, then stops to breathe. Fever has taken the strength from their voice. The treatment exists. They cannot pay for it. Your boat can turn.",
      actions: ["turn the boat toward them", "hold your course", "slow the boat — it depends"]
    },
    {
      id: "forgiveness-b", situationId: "forgiveness", pass: "second",
      kicker: "A name you already know", title: "You know the name before the voice.",
      copy: "You recognise them before they speak. For years, people on your shore have used their name as shorthand for disgrace. They say what they did without excuses. They cannot undo it. They say they are trying not to become it again.",
      actions: ["offer a hand", "leave them to the water", "keep the boat near — it depends"]
    }
  ]
};
