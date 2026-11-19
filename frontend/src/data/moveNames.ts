// TCG 카드 기술명 영어 → 한국어 매핑
export const MOVE_NAMES_KO: Record<string, string> = {
  // 노말
  'Tackle': '몸통박치기', 'Body Slam': '바디슬램', 'Hyper Beam': '하이퍼빔',
  'Headbutt': '박치기', 'Skull Bash': '로켓박치기', 'Take Down': '돌진',
  'Double Edge': '이중챱', 'Quick Attack': '전광석화', 'Slam': '내팽개치기',
  'Stomp': '구르기', 'Pound': '할퀴기', 'Scratch': '할퀴기',
  'Cut': '베기', 'Slash': '베어가르기', 'Fury Swipes': '연속할퀴기',
  'Mega Punch': '메가톤펀치', 'Mega Kick': '메가톤킥', 'Strength': '괴력',
  'Comet Punch': '연속펀치', 'Double Slap': '더블슬랩', 'Submission': '되치기',
  'Dizzy Punch': '어지럽히기', 'Egg Bomb': '에그폭탄', 'Barrage': '구술던지기',
  'Swift': '스위프트', 'Tri Attack': '트리어택', 'Explosion': '대폭발',
  'Self-Destruct': '자폭', 'Wrap': '칭칭감기', 'Bind': '꽁꽁묶기',
  'Normal': '노말', 'Growl': '울음소리', 'Tail Whip': '꼬리치기',
  'Leer': '날카로운눈', 'Screech': '금속성', 'Amnesia': '기억지우기',
  'Minimize': '미니화', 'Splash': '첨벙', 'Spit Up': '뱉어내기',

  // 불꽃
  'Ember': '불꽃', 'Flamethrower': '화염방사', 'Fire Blast': '불대문자',
  'Fire Spin': '불꽃소용돌이', 'Inferno': '지옥불', 'Flame Burst': '불꽃터뜨리기',
  'Heat Wave': '열풍', 'Overheat': '오버히트', 'Blast Burn': '폭렬화염',
  'Eruption': '분화', 'Flare Blitz': '플레어드라이브', 'Fire Punch': '불꽃펀치',
  'Fire Fang': '불꽃엄니', 'Will-O-Wisp': '도깨비불', 'Sunny Day': '맑게개기',
  'Combustion': '연소', 'Infernal Parade': '지옥의행렬',

  // 물
  'Water Gun': '물대포', 'Surf': '파도타기', 'Hydro Pump': '하이드로펌프',
  'Bubble': '거품', 'Bubble Beam': '거품광선', 'Clamp': '조개껍데기',
  'Crabhammer': '집게드라이버', 'Waterfall': '폭포오르기', 'Aqua Tail': '아쿠아테일',
  'Water Pulse': '파도치기', 'Aqua Jet': '아쿠아제트', 'Brine': '조수',
  'Rain Dance': '비바라기', 'Whirlpool': '용오름', 'Dive': '다이빙',
  'Liquidation': '폭포오르기', 'Origin Pulse': '근원의파동',

  // 전기
  'Thunder Shock': '전기충격', 'Thunderbolt': '10만볼트', 'Thunder': '천둥',
  'Thunder Wave': '전기자석파', 'Thunder Punch': '번개펀치', 'Zap Cannon': '전자포',
  'Discharge': '방전', 'Volt Tackle': '볼트태클', 'Wild Charge': '와일드볼트',
  'Spark': '스파크', 'Electro Ball': '전자포', 'Charge Beam': '충전빔',

  // 풀
  'Vine Whip': '넝쿨채찍', 'Razor Leaf': '잎날가르기', 'Solar Beam': '솔라빔',
  'Leaf Blade': '리프블레이드', 'Petal Dance': '꽃잎댄스', 'Giga Drain': '기가드레인',
  'Mega Drain': '메가드레인', 'Absorb': '흡수', 'Leech Seed': '씨뿌리기',
  'Grass Knot': '풀묶기', 'Leaf Storm': '리프스톰', 'Energy Ball': '에너지볼',
  'Seed Bomb': '씨폭탄', 'Bullet Seed': '씨기관총', 'Power Whip': '파워휩',

  // 얼음
  'Ice Beam': '냉동빔', 'Blizzard': '눈보라', 'Ice Punch': '아이스펀치',
  'Aurora Beam': '오로라빔', 'Freeze Dry': '냉동건조', 'Icicle Crash': '고드름떨구기',
  'Ice Shard': '얼음뭉치', 'Hail': '싸라기눈', 'Powder Snow': '분설',
  'Frost Breath': '차가운입김', 'Glaciate': '빙결세계',

  // 격투
  'Low Kick': '발치기', 'Karate Chop': '공수가르기', 'Seismic Toss': '지구던지기',
  'Counter': '카운터', 'Focus Energy': '기합모으기',
  'High Jump Kick': '점프킥', 'Rolling Kick': '돌려차기', 'Brick Break': '벽깨기',
  'Close Combat': '인파이트', 'Drain Punch': '드레인펀치', 'Mach Punch': '마하펀치',
  'Cross Chop': '크로스촙', 'Superpower': '수퍼파워', 'Focus Blast': '기합구',
  'Dynamic Punch': '다이나믹펀치', 'Aura Sphere': '파동탄',

  // 독
  'Poison Sting': '독침', 'Acid': '산성비', 'Sludge': '오물공격',
  'Sludge Bomb': '오물폭탄', 'Toxic': '독',  'Venoshock': '독다이빙',
  'Poison Fang': '독엄니', 'Cross Poison': '크로스포이즌', 'Gunk Shot': '더러운폭탄',
  'Acid Spray': '산성폭탄',

  // 땅
  'Earthquake': '지진', 'Dig': '구멍파기', 'Fissure': '균열',
  'Sand Attack': '모래뿌리기', 'Mud Slap': '진흙뿌리기', 'Earth Power': '지반폭발',
  'Mud Shot': '진흙폭탄', 'Spikes': '압정뿌리기', 'Bone Club': '뼈다귀치기',
  'Bonemerang': '부메랑뼈다귀', 'Bone Rush': '뼈다귀러시',

  // 비행
  'Gust': '돌풍', 'Wing Attack': '날개치기', 'Peck': '쪼기',
  'Drill Peck': '드릴부리', 'Fly': '날기', 'Aerial Ace': '애크러뱃',
  'Air Slash': '에어슬래시', 'Brave Bird': '브레이브버드', 'Hurricane': '폭풍',
  'Pluck': '쪼아먹기', 'Acrobatics': '애크러뱃',

  // 에스퍼
  'Confusion': '염동력', 'Psychic': '사이코키네시스', 'Psybeam': '사이코빔',
  'Psyshock': '사이코쇼크', 'Psystrike': '사이코브레이크', 'Future Sight': '미래예지',
  'Calm Mind': '명상', 'Agility': '고속이동', 'Kinesis': '텔레파시',
  'Dream Eater': '꿈먹기', 'Extrasensory': '초감각', 'Zen Headbutt': '선행타',
  'Stored Power': '어둠의파동',

  // 벌레
  'String Shot': '실뱉기', 'Bug Bite': '벌레먹기', 'Signal Beam': '신호탄',
  'X-Scissor': '크로스기요틴', 'Bug Buzz': '버그버즈', 'Megahorn': '메가폰',
  'Leech Life': '흡혈', 'Pin Missile': '핀미사일',

  // 바위
  'Rock Throw': '돌던지기', 'Rock Slide': '바위떨어뜨리기', 'Rock Blast': '연속바위치기',
  'Stone Edge': '스톤에지', 'Rock Wrecker': '바위깨뜨리기', 'Head Smash': '헤드스매시',
  'Smack Down': '내려치기', 'Stealth Rock': '스텔스록',

  // 고스트
  'Lick': '핥기', 'Night Shade': '나이트헤드', 'Shadow Ball': '섀도볼',
  'Shadow Claw': '섀도클로', 'Hex': '저주놀이', 'Phantom Force': '수칙그림자',
  'Spirit Shackle': '영혼의닻', 'Poltergeist': '폴터가이스트',
  'Nightmare': '나이트메어', 'Curse': '저주',

  // 드래곤
  'Dragon Rage': '용의분노', 'Dragon Breath': '용의숨결', 'Dragon Claw': '드래곤클로',
  'Draco Meteor': '드레코메테오', 'Outrage': '역린', 'Dragon Pulse': '용의파동',
  'Dragon Rush': '드래곤다이브', 'Dragon Tail': '드래곤테일',

  // 악
  'Bite': '물기', 'Crunch': '깨물기', 'Night Slash': '악의파동',
  'Foul Play': '훼방놓기', 'Dark Pulse': '악의파동', 'Pursuit': '계속도주',
  'Sucker Punch': '선제공격', 'Payback': '앙갚음',

  // 강철
  'Metal Claw': '메탈클로', 'Iron Tail': '아이언테일', 'Flash Cannon': '미러샷',
  'Meteor Mash': '유성펀치', 'Bullet Punch': '불릿펀치', 'Iron Head': '아이언헤드',
  'Gyro Ball': '자이로볼', 'Steel Wing': '강철날개', 'Heavy Slam': '헤비봄버',

  // 페어리
  'Fairy Wind': '페어리윈드', 'Dazzling Gleam': '매혹적인빛', 'Moonblast': '문포스',
  'Play Rough': '흥클어뜨리기', 'Charm': '애교부리기', 'Disarming Voice': '수다쟁이',

  // TCG 전용 / 일반 기술
  'Energy Burn': '에너지소각', 'Giant Wave': '거대한파도', 'Explosion Nova': '대폭발',
  'Lost Cyclone': '로스트사이클론', 'Stellar Blade': '스텔라블레이드',
  'Psy Purge': '사이코퍼지', 'Hyper Drill': '하이퍼드릴', 'Jet Punch': '제트펀치',
  'Origin Beam': '근원의빔', 'Genomis': '유전자',
}

const moveCache = new Map<string, string | null>()

export async function fetchMoveNameKo(enName: string): Promise<string> {
  if (MOVE_NAMES_KO[enName]) return MOVE_NAMES_KO[enName]
  if (moveCache.has(enName)) return moveCache.get(enName) ?? enName

  // PokeAPI 기술명으로 변환 시도 (소문자 + 하이픈)
  const apiKey = enName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/move/${apiKey}`)
    if (!res.ok) { moveCache.set(enName, null); return enName }
    const data = await res.json()
    const ko = data.names?.find((n: any) => n.language.name === 'ko')?.name ?? null
    moveCache.set(enName, ko)
    return ko ?? enName
  } catch {
    moveCache.set(enName, null)
    return enName
  }
}
