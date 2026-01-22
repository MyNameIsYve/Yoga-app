import { Pose } from '@/lib/types';

// User's custom pose collection - 57 poses
// Images should be placed in /public/images/
export const seedPoses: Pose[] = [
  // ========== BEGINNER POSES (17) ==========
  {
    id: '1',
    name: 'Mountain Pose',
    sanskritName: '山式 (Shānshì)',
    category: 'standing',
    imageUrl: '/images/Mountain Pose.png',
    cues: [
      'Stand tall with feet hip-width apart',
      'Engage thighs and lift kneecaps',
      'Lengthen through crown of head'
    ],
    defaultDuration: 120, // 2 minutes
    difficulty: 'beginner',
    benefits: ['Improves posture', 'Builds foundation', 'Increases body awareness']
  },
  {
    id: '2',
    name: 'Tree Pose',
    sanskritName: '树式 (Shùshì)',
    category: 'balance',
    imageUrl: '/images/Tree Pose.png',
    cues: [
      'Root down through standing foot',
      'Place other foot on inner thigh or calf',
      'Hands at heart or reaching up'
    ],
    defaultDuration: 30, // 3-5 breaths ≈ 30s
    difficulty: 'beginner',
    benefits: ['Improves balance', 'Strengthens legs', 'Increases focus']
  },
  {
    id: '3',
    name: 'Standing Forward Fold',
    sanskritName: '站立前屈式 (Zhànlì Qiánqūshì)',
    category: 'forward-fold',
    imageUrl: '/images/Standing Forward Fold.png',
    cues: [
      'Hinge at hips, fold forward',
      'Micro-bend knees if needed',
      'Let head and arms hang heavy'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'beginner',
    benefits: ['Stretches hamstrings', 'Calms nervous system', 'Relieves tension']
  },
  {
    id: '4',
    name: 'Crescent Moon',
    sanskritName: '新月式 (Xīnyuèshì)',
    category: 'standing',
    imageUrl: '/images/High Lunge.png',
    cues: [
      'Front knee over ankle',
      'Back knee on mat or lifted',
      'Arms reach up and back'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'beginner',
    benefits: ['Opens hip flexors', 'Strengthens legs', 'Improves balance']
  },
  {
    id: '5',
    name: 'Garland Pose',
    sanskritName: '简易花环式 (Jiǎnyì Huāhuánshì)',
    category: 'seated',
    imageUrl: '/images/Garland Pose.png',
    cues: [
      'Squat with feet hip-width apart',
      'Hands at heart center',
      'Elbows press knees outward'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'beginner',
    benefits: ['Opens hips', 'Stretches ankles', 'Aids digestion']
  },
  {
    id: '6',
    name: 'Staff Pose',
    sanskritName: '手杖式 (Shǒuzhàngshì)',
    category: 'seated',
    imageUrl: '/images/Staff Pose.png',
    cues: [
      'Sit with legs extended forward',
      'Flex feet, engage thighs',
      'Spine tall, hands beside hips'
    ],
    defaultDuration: 60, // 1 minute
    difficulty: 'beginner',
    benefits: ['Strengthens back', 'Improves posture', 'Prepares for forward folds']
  },
  {
    id: '7',
    name: 'Head-to-Knee Pose',
    sanskritName: '单腿背部伸展式 (Dāntuǐ Bèibù Shēnzhǎnshì)',
    category: 'forward-fold',
    imageUrl: '/images/Head-to-Knee Pose.png',
    cues: [
      'One leg extended, other foot to inner thigh',
      'Fold forward over extended leg',
      'Keep spine long'
    ],
    defaultDuration: 150, // 2-3 minutes
    difficulty: 'beginner',
    benefits: ['Stretches hamstrings', 'Calms mind', 'Stimulates digestion']
  },
  {
    id: '8',
    name: 'Thunderbolt Pose',
    sanskritName: '金刚坐式 (Jīngāngzuòshì)',
    category: 'seated',
    imageUrl: '/images/Thunderbolt Pose.png',
    cues: [
      'Kneel and sit back on heels',
      'Spine tall, hands on thighs',
      'Shoulders relaxed'
    ],
    defaultDuration: 180, // 3-5 minutes
    difficulty: 'beginner',
    benefits: ['Aids digestion', 'Improves posture', 'Calms mind']
  },
  {
    id: '9',
    name: 'Cat-Cow Pose',
    sanskritName: '猫牛式 (Māoniúshì)',
    category: 'prone',
    imageUrl: '/images/Cat-Cow Pose.png',
    cues: [
      'Start on hands and knees',
      'Inhale: arch back, lift chest',
      'Exhale: round spine, tuck chin'
    ],
    defaultDuration: 60, // 5-8 sets
    difficulty: 'beginner',
    benefits: ['Warms spine', 'Improves flexibility', 'Relieves back tension']
  },
  {
    id: '10',
    name: "Extended Child's Pose",
    sanskritName: '大拜式 (Dàbàishì)',
    category: 'prone',
    imageUrl: "/images/Extended Child's Pose.png",
    cues: [
      'Knees wide, big toes touching',
      'Sit hips back toward heels',
      'Arms extended, forehead to mat'
    ],
    defaultDuration: 120, // 1-3 minutes
    difficulty: 'beginner',
    benefits: ['Gentle rest', 'Releases lower back', 'Calms nervous system']
  },
  {
    id: '11',
    name: 'Cobra Pose',
    sanskritName: '眼镜蛇式 (Yǎnjìngshéshì)',
    category: 'backbend',
    imageUrl: '/images/Cobra Pose.png',
    cues: [
      'Lie on belly, hands under shoulders',
      'Press hands, lift chest',
      'Keep elbows slightly bent'
    ],
    defaultDuration: 40, // 5-8 breaths
    difficulty: 'beginner',
    benefits: ['Strengthens back', 'Opens chest', 'Energizes body']
  },
  {
    id: '12',
    name: 'Thread the Needle',
    sanskritName: '穿针式 (Chuānzhēnshì)',
    category: 'twist',
    imageUrl: '/images/Reclined Twist.png',
    cues: [
      'Start on hands and knees',
      'Thread one arm under the other',
      'Shoulder and ear rest on mat'
    ],
    defaultDuration: 40, // 5-8 breaths
    difficulty: 'beginner',
    benefits: ['Stretches shoulders', 'Releases upper back', 'Gentle twist']
  },
  {
    id: '13',
    name: 'Happy Baby Pose',
    sanskritName: '快乐婴儿式 (Kuàilè Yīngérshì)',
    category: 'supine',
    imageUrl: '/images/Happy Baby Pose.png',
    cues: [
      'Lie on back, knees to chest',
      'Hold outside edges of feet',
      'Rock gently side to side'
    ],
    defaultDuration: 90, // 1-2 minutes
    difficulty: 'beginner',
    benefits: ['Opens hips', 'Releases lower back', 'Playful and relaxing']
  },
  {
    id: '14',
    name: 'Reclined Pigeon',
    sanskritName: '仰卧穿针式 (Yǎngwò Chuānzhēnshì)',
    category: 'supine',
    imageUrl: '/images/Reclined Pigeon.png',
    cues: [
      'Lie on back, cross ankle over opposite knee',
      'Thread hands behind thigh',
      'Draw legs toward chest'
    ],
    defaultDuration: 40, // 5-8 breaths
    difficulty: 'beginner',
    benefits: ['Deep hip stretch', 'Releases tension', 'Gentle on knees']
  },
  {
    id: '15',
    name: 'Bridge Pose',
    sanskritName: '桥式 (Qiáoshì)',
    category: 'backbend',
    imageUrl: '/images/Bridge Pose.png',
    cues: [
      'Lie on back, feet hip-width apart',
      'Press into feet, lift hips',
      'Chest moves toward chin'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'beginner',
    benefits: ['Strengthens back and glutes', 'Opens chest', 'Energizes body']
  },
  {
    id: '16',
    name: 'Reclined Twist',
    sanskritName: '仰卧扭转式 (Yǎngwò Niǔzhuǎnshì)',
    category: 'twist',
    imageUrl: '/images/Reclined Twist.png',
    cues: [
      'Lie on back, knees to chest',
      'Drop knees to one side',
      'Arms in T, gaze opposite direction'
    ],
    defaultDuration: 40, // 5-8 breaths
    difficulty: 'beginner',
    benefits: ['Releases spine', 'Aids digestion', 'Calming']
  },
  {
    id: '17',
    name: 'Corpse Pose',
    sanskritName: '摊尸式 (Tānshīshì)',
    category: 'supine',
    imageUrl: '/images/Corpse Pose.png',
    cues: [
      'Lie flat on back',
      'Arms at sides, palms up',
      'Close eyes, relax completely'
    ],
    defaultDuration: 600, // 10-20 minutes
    difficulty: 'beginner',
    benefits: ['Deep relaxation', 'Reduces stress', 'Integrates practice']
  },

  // ========== INTERMEDIATE POSES (28) ==========
  {
    id: '18',
    name: 'Warrior I',
    sanskritName: '战士一式 (Zhànshì Yīshì)',
    category: 'standing',
    imageUrl: '/images/Warrior I.png',
    cues: [
      'Front knee over ankle at 90 degrees',
      'Back leg straight and strong',
      'Arms reach up, shoulders down'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'intermediate',
    benefits: ['Strengthens legs', 'Opens hips', 'Builds focus']
  },
  {
    id: '19',
    name: 'Warrior II',
    sanskritName: '战士二式 (Zhànshì Èrshì)',
    category: 'standing',
    imageUrl: '/images/Warrior II.png',
    cues: [
      'Arms parallel to floor',
      'Gaze over front fingertips',
      'Front knee tracks over second toe'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'intermediate',
    benefits: ['Builds stamina', 'Strengthens legs', 'Opens hips']
  },
  {
    id: '20',
    name: 'Reverse Warrior',
    sanskritName: '反战式 (Fǎnzhànshì)',
    category: 'standing',
    imageUrl: '/images/Reverse Warrior.png',
    cues: [
      'From Warrior II, reach back arm down leg',
      'Front arm reaches up and back',
      'Open chest toward sky'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'intermediate',
    benefits: ['Side body stretch', 'Opens chest', 'Energizing']
  },
  {
    id: '21',
    name: 'Triangle Pose',
    sanskritName: '三角伸展式 (Sānjiǎo Shēnzhǎnshì)',
    category: 'standing',
    imageUrl: '/images/Triangle Pose.png',
    cues: [
      'Extend through both sides of body',
      'Front hand reaches down',
      'Back arm reaches up'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'intermediate',
    benefits: ['Stretches side body', 'Strengthens legs', 'Improves balance']
  },
  {
    id: '22',
    name: 'Revolved Triangle',
    sanskritName: '三角扭转式 (Sānjiǎo Niǔzhuǎnshì)',
    category: 'twist',
    imageUrl: '/images/Revolved Triangle Pose.png',
    cues: [
      'Square hips to front',
      'Twist torso, opposite hand to outside of foot',
      'Top arm reaches up'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'intermediate',
    benefits: ['Deep twist', 'Improves balance', 'Strengthens core']
  },
  {
    id: '23',
    name: 'Chair Pose',
    sanskritName: '幻椅式 (Huànyǐshì)',
    category: 'standing',
    imageUrl: '/images/Chair Pose.png',
    cues: [
      'Feet together or hip-width',
      'Sit hips back, weight in heels',
      'Arms reach up'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'intermediate',
    benefits: ['Strengthens thighs', 'Tones core', 'Builds heat']
  },
  {
    id: '24',
    name: 'Spear Pose',
    sanskritName: '矛式 (Máoshì)',
    category: 'standing',
    imageUrl: '/images/High Lunge.png',
    cues: [
      'Low lunge position',
      'Reach back for back foot',
      'Quad stretch with balance'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'intermediate',
    benefits: ['Opens hip flexors', 'Improves balance', 'Strengthens legs']
  },
  {
    id: '25',
    name: 'High Lunge',
    sanskritName: '高弓步式 (Gāo Gōngbùshì)',
    category: 'standing',
    imageUrl: '/images/High Lunge.png',
    cues: [
      'Front knee over ankle',
      'Back heel lifted, leg straight',
      'Arms reach up or at heart'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'intermediate',
    benefits: ['Strengthens legs', 'Opens hips', 'Improves balance']
  },
  {
    id: '26',
    name: 'Intense Side Stretch',
    sanskritName: '加强侧伸展式',
    category: 'forward-fold',
    imageUrl: '/images/Intense Side Stretch.png',
    cues: [
      'Square hips to front',
      'Fold forward over front leg',
      'Hands on floor or blocks'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'intermediate',
    benefits: ['Hamstring stretch', 'Calms mind', 'Improves balance']
  },
  {
    id: '27',
    name: 'Extended Side Angle',
    sanskritName: '侧角伸展式 (Cèjiǎo Shēnzhǎnshì)',
    category: 'standing',
    imageUrl: '/images/Extended Side Angle Pose.png',
    cues: [
      'From Warrior II, forearm to thigh',
      'Top arm extends over ear',
      'Create long line from foot to fingertips'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'intermediate',
    benefits: ['Side body stretch', 'Strengthens legs', 'Opens chest']
  },
  {
    id: '28',
    name: 'Half Moon Pose',
    sanskritName: '半月式 (Bànyuèshì)',
    category: 'balance',
    imageUrl: '/images/Half Moon Pose.png',
    cues: [
      'Balance on one leg',
      'Bottom hand on floor or block',
      'Top leg parallel to ground'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'intermediate',
    benefits: ['Improves balance', 'Strengthens legs', 'Opens hips']
  },
  {
    id: '29',
    name: 'Wide-Legged Forward Fold',
    sanskritName: '双角式 (Shuāngjiǎoshì)',
    category: 'forward-fold',
    imageUrl: '/images/Wide-Legged Forward Fold.png',
    cues: [
      'Legs wide apart',
      'Fold forward at hips',
      'Head toward floor, hands on ground'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'intermediate',
    benefits: ['Hamstring stretch', 'Calms mind', 'Mild inversion']
  },
  {
    id: '30',
    name: 'Hero Pose',
    sanskritName: '英雄坐姿 (Yīngxióng Zuòzī)',
    category: 'seated',
    imageUrl: '/images/Hero Pose.png',
    cues: [
      'Kneel, sit between heels',
      'Spine tall, hands on thighs',
      'Relax shoulders'
    ],
    defaultDuration: 180, // 3-5 minutes
    difficulty: 'intermediate',
    benefits: ['Stretches quads', 'Improves posture', 'Aids digestion']
  },
  {
    id: '31',
    name: 'Cow Face Pose',
    sanskritName: '牛面式 (Niúmiànshì)',
    category: 'seated',
    imageUrl: '/images/Cow Face Pose.png',
    cues: [
      'Cross one knee over other',
      'Reach arms behind back, clasp hands',
      'Sit tall'
    ],
    defaultDuration: 60, // 1 minute
    difficulty: 'intermediate',
    benefits: ['Hip and shoulder stretch', 'Improves flexibility', 'Opens chest']
  },
  {
    id: '32',
    name: 'Fire Log Pose',
    sanskritName: '方块式 (Fāngkuàishì)',
    category: 'seated',
    imageUrl: '/images/Fire Log Pose.png',
    cues: [
      'Stack shins, ankles over knees',
      'Sit tall or fold forward',
      'Flex feet'
    ],
    defaultDuration: 120, // 1-3 minutes
    difficulty: 'intermediate',
    benefits: ['Deep hip opener', 'Releases tension', 'Grounding']
  },
  {
    id: '33',
    name: 'Wide-Angle Seated Forward Fold',
    sanskritName: '坐角式 (Zuòjiǎoshì)',
    category: 'forward-fold',
    imageUrl: '/images/Wide-Angle Seated Fold.png',
    cues: [
      'Sit with legs wide apart',
      'Walk hands forward',
      'Fold at hips, keep spine long'
    ],
    defaultDuration: 120, // 1-3 minutes
    difficulty: 'intermediate',
    benefits: ['Inner thigh stretch', 'Hamstring stretch', 'Calming']
  },
  {
    id: '34',
    name: 'Half Lord of the Fishes',
    sanskritName: '坐姿扭转式 (Zuòzī Niǔzhuǎnshì)',
    category: 'twist',
    imageUrl: '/images/Seated Twist.png',
    cues: [
      'Sit with one leg crossed',
      'Twist toward bent knee',
      'Opposite elbow outside knee'
    ],
    defaultDuration: 30, // 3-5 breaths
    difficulty: 'intermediate',
    benefits: ['Spinal twist', 'Aids digestion', 'Energizing']
  },
  {
    id: '35',
    name: 'Pigeon Pose',
    sanskritName: '鸽子式 (Gēzishì)',
    category: 'seated',
    imageUrl: '/images/Pigeon Pose.png',
    cues: [
      'Front shin parallel to mat edge',
      'Back leg extended straight',
      'Fold forward or stay upright'
    ],
    defaultDuration: 120, // 1-3 minutes
    difficulty: 'intermediate',
    benefits: ['Deep hip opener', 'Releases tension', 'Grounding']
  },
  {
    id: '36',
    name: 'Boat Pose',
    sanskritName: '船式 (Chuánshì)',
    category: 'seated',
    imageUrl: '/images/Boat Pose.png',
    cues: [
      'Balance on sitting bones',
      'Lift legs, shins parallel to floor',
      'Arms extend forward'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'intermediate',
    benefits: ['Strengthens core', 'Hip flexor work', 'Improves balance']
  },
  {
    id: '37',
    name: 'Downward Facing Dog',
    sanskritName: '下犬式 (Xiàquǎnshì)',
    category: 'inversion',
    imageUrl: '/images/Downward Facing Dog.png',
    cues: [
      'Hands shoulder-width, feet hip-width',
      'Lift hips high, press chest toward thighs',
      'Heels reach toward floor'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'intermediate',
    benefits: ['Full body stretch', 'Strengthens arms', 'Energizes']
  },
  {
    id: '38',
    name: 'Gate Pose',
    sanskritName: '门闩式 (Ménshuānshì)',
    category: 'standing',
    imageUrl: '/images/Gate Pose.png',
    cues: [
      'One knee down, other leg extended',
      'Reach arm over toward extended leg',
      'Open chest upward'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'intermediate',
    benefits: ['Side body stretch', 'Opens hips', 'Improves flexibility']
  },
  {
    id: '39',
    name: 'Lizard Lunge',
    sanskritName: '龙式 (Lóngshì)',
    category: 'standing',
    imageUrl: '/images/Lizard Lunge.png',
    cues: [
      'Low lunge, both hands inside front foot',
      'Drop back knee or keep lifted',
      'Lower onto forearms if available'
    ],
    defaultDuration: 60, // 1 minute
    difficulty: 'intermediate',
    benefits: ['Deep hip stretch', 'Opens groin', 'Strengthens legs']
  },
  {
    id: '40',
    name: 'Plow Pose',
    sanskritName: '犁式 (Líshì)',
    category: 'inversion',
    imageUrl: '/images/Plow Pose.png',
    cues: [
      'Lie on back, lift legs overhead',
      'Toes touch floor behind head',
      'Hands support lower back or clasp'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'intermediate',
    benefits: ['Calms nervous system', 'Stretches spine', 'Stimulates thyroid']
  },
  {
    id: '41',
    name: 'Dolphin Pose',
    sanskritName: '海豚式 (Hǎitúnshì)',
    category: 'inversion',
    imageUrl: '/images/Dolphin Pose.png',
    cues: [
      'Forearms on ground, shoulder-width',
      'Lift hips like downward dog',
      'Head between arms'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'intermediate',
    benefits: ['Strengthens shoulders', 'Prepares for headstand', 'Energizing']
  },
  {
    id: '42',
    name: 'Upward Facing Dog',
    sanskritName: '上犬式 (Shàngquǎnshì)',
    category: 'backbend',
    imageUrl: '/images/Cobra Pose.png',
    cues: [
      'Hands under shoulders',
      'Lift chest and thighs off mat',
      'Straighten arms, open chest'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'intermediate',
    benefits: ['Strengthens back', 'Opens chest', 'Energizes']
  },
  {
    id: '43',
    name: 'Fish Pose',
    sanskritName: '鱼式 (Yúshì)',
    category: 'backbend',
    imageUrl: '/images/Bridge Pose.png',
    cues: [
      'Lie on back, arch chest up',
      'Crown of head lightly on floor',
      'Legs extended or in lotus'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'intermediate',
    benefits: ['Opens chest and throat', 'Counter to shoulder stand', 'Energizing']
  },
  {
    id: '44',
    name: 'Legs Up the Wall',
    sanskritName: '靠墙抬腿式',
    category: 'inversion',
    imageUrl: '/images/Legs Up The Wall.png',
    cues: [
      'Lie with hips close to wall',
      'Extend legs up wall',
      'Arms rest at sides, palms up'
    ],
    defaultDuration: 300, // 5+ minutes
    difficulty: 'beginner',
    benefits: ['Improves circulation', 'Reduces swelling', 'Deeply relaxing']
  },
  {
    id: '45',
    name: 'Eagle Pose',
    sanskritName: '鹰式 (Yīngshì)',
    category: 'balance',
    imageUrl: '/images/Eagle Pose.png',
    cues: [
      'Wrap one leg around the other',
      'Wrap opposite arm on top',
      'Sink into standing leg'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'intermediate',
    benefits: ['Improves balance', 'Opens shoulders', 'Strengthens legs']
  },

  // ========== ADVANCED POSES (12) ==========
  {
    id: '46',
    name: 'Warrior III',
    sanskritName: '战士三式 (Zhànshì Sānshì)',
    category: 'balance',
    imageUrl: '/images/Warrior III.png',
    cues: [
      'Balance on one leg',
      'Torso and back leg parallel to floor',
      'Arms extended forward or at sides'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'advanced',
    benefits: ['Improves balance', 'Strengthens legs and core', 'Focus']
  },
  {
    id: '47',
    name: 'Bound Side Angle',
    sanskritName: '侧角绑定式',
    category: 'standing',
    imageUrl: '/images/Bound Side Angle.png',
    cues: [
      'From Side Angle, bind arms behind back',
      'Bottom arm threads under thigh',
      'Clasp hands behind back'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'advanced',
    benefits: ['Deep hip and shoulder opener', 'Improves flexibility', 'Challenging bind']
  },
  {
    id: '48',
    name: 'Revolved Side Angle',
    sanskritName: '侧角扭转式 (Cèjiǎo Niǔzhuǎnshì)',
    category: 'twist',
    imageUrl: '/images/Revolved Side Angle.png',
    cues: [
      'From lunge, twist deeply',
      'Bottom elbow outside front knee',
      'Top arm reaches up or binds'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'advanced',
    benefits: ['Deep twist', 'Strengthens core', 'Improves balance']
  },
  {
    id: '49',
    name: 'Revolved Half Moon',
    sanskritName: '半月扭转式 (Bànyuè Niǔzhuǎnshì)',
    category: 'balance',
    imageUrl: '/images/Revolved Half Moon.png',
    cues: [
      'Balance on one leg',
      'Twist torso, opposite hand to floor',
      'Top arm reaches up'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'advanced',
    benefits: ['Balance and twist', 'Strengthens core', 'Improves focus']
  },
  {
    id: '50',
    name: 'King Dancer Pose',
    sanskritName: '舞蹈式 (Wǔdǎoshì)',
    category: 'balance',
    imageUrl: '/images/Wild Thing.png',
    cues: [
      'Balance on one leg',
      'Reach back, hold foot',
      'Kick into hand, lean forward'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'advanced',
    benefits: ['Backbend and balance', 'Opens chest and shoulders', 'Strengthens legs']
  },
  {
    id: '51',
    name: 'Lotus Pose',
    sanskritName: '莲花坐姿 (Liánhuā Zuòzī)',
    category: 'seated',
    imageUrl: '/images/Lotus Pose.png',
    cues: [
      'Cross legs, feet on opposite thighs',
      'Sit tall, hands on knees',
      'Requires flexible hips'
    ],
    defaultDuration: 180, // 3-5 minutes
    difficulty: 'advanced',
    benefits: ['Hip opener', 'Meditation posture', 'Calming']
  },
  {
    id: '52',
    name: 'Four-Limbed Staff Pose',
    sanskritName: '四柱式 (Sìzhùshì)',
    category: 'prone',
    imageUrl: '/images/Four-Limbed Staff Pose.png',
    cues: [
      'From plank, lower halfway down',
      'Elbows hug ribs at 90 degrees',
      'Body in straight line'
    ],
    defaultDuration: 20, // 3-5 breaths
    difficulty: 'advanced',
    benefits: ['Strengthens arms and core', 'Builds upper body strength', 'Prepares for arm balances']
  },
  {
    id: '53',
    name: 'Crow Pose',
    sanskritName: '乌鸦式 (Wūyāshì)',
    category: 'balance',
    imageUrl: '/images/Crow Pose.png',
    cues: [
      'Squat, place hands on floor',
      'Knees on backs of arms',
      'Shift weight forward, lift feet'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'advanced',
    benefits: ['Arm balance', 'Strengthens arms and core', 'Improves focus']
  },
  {
    id: '54',
    name: 'Full Splits',
    sanskritName: '神猴哈努曼式',
    category: 'seated',
    imageUrl: '/images/Full Splits.png',
    cues: [
      'Slide front leg forward, back leg back',
      'Square hips to front',
      'Hands on floor or blocks for support'
    ],
    defaultDuration: 90, // 1-2 minutes
    difficulty: 'advanced',
    benefits: ['Deep hamstring and hip flexor stretch', 'Improves flexibility', 'Grounding']
  },
  {
    id: '55',
    name: 'Camel Pose',
    sanskritName: '骆驼式 (Luòtuóshì)',
    category: 'backbend',
    imageUrl: '/images/Camel Pose.png',
    cues: [
      'Kneel, hands on lower back',
      'Lift chest, arch back',
      'Reach for heels if available'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'advanced',
    benefits: ['Deep backbend', 'Opens chest and hip flexors', 'Energizing']
  },
  {
    id: '56',
    name: 'Wheel Pose',
    sanskritName: '轮式 (Lúnshì)',
    category: 'backbend',
    imageUrl: '/images/Wheel Pose.png',
    cues: [
      'Lie on back, hands by ears',
      'Press into hands and feet',
      'Lift entire body into arch'
    ],
    defaultDuration: 30, // 5 breaths
    difficulty: 'advanced',
    benefits: ['Full backbend', 'Strengthens entire body', 'Very energizing']
  },
  {
    id: '57',
    name: 'Frog Pose',
    sanskritName: '青蛙趴 (Qīngwāpā)',
    category: 'prone',
    imageUrl: '/images/Frog Pose.png',
    cues: [
      'On hands and knees, slide knees wide',
      'Inner edges of feet on floor',
      'Lower to forearms, hips sink back'
    ],
    defaultDuration: 180, // 3-5 minutes
    difficulty: 'advanced',
    benefits: ['Deep hip opener', 'Stretches inner thighs', 'Grounding']
  },
];
