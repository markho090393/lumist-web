<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

type CenterItem = { zh: string; en: string; from: string; to: string; icon: string; route?: string; fill: string }
type QuickItem = { zh: string; en: string; from: string; to: string; icon: string }

const router = useRouter()

// 练习中心
const centerList: CenterItem[] = [
  { zh: '单词训练', en: 'Word training', from: '#9AD3FF', to: '#D6EAFF', icon: 'i-ph:letter-a-bold', route: '/home/word-training', fill: '#E6F6FF' },
  { zh: '抗遗忘', en: 'Anti forgetting', from: '#FFE27D', to: '#FFF1BF', icon: 'i-ph:lightbulb-filament', fill: '#FFFBE7' },
  { zh: '遗忘强化', en: 'Forgetting reinforcement', from: '#D9CCFF', to: '#EEE9FF', icon: 'i-ph:check-circle', fill: '#F3EEFF' },
  { zh: '词汇量检测', en: 'Vocabulary testing', from: '#B8F1D8', to: '#E6FFF4', icon: 'i-ph:chat-centered-dots', fill: '#EAFFF7' },
]

// 快速练习
const quickList: QuickItem[] = [
  { zh: '音标练习', en: 'Phonetic symbol practice', from: '#FFE2A7', to: '#FFF1CF', icon: 'i-ph:app-store-logo' },
  { zh: '短语练习', en: 'Phrase Practice', from: '#B6E2FF', to: '#E2F2FF', icon: 'i-ph:pentagram-simple' },
  { zh: '语法练习', en: 'grammar exercises', from: '#B6F4CC', to: '#E9FFF4', icon: 'i-ph:abc' },
  { zh: '阅读练习', en: 'reading exercises', from: '#D7D1FF', to: '#EEE9FF', icon: 'i-ph:square-logo' },
  { zh: '口语训练', en: 'oral practice', from: '#F9E38D', to: '#FFF4BA', icon: 'i-ph:chat-circle-dots' },
]

const sectors = [
  { start: -180, end: -144, color: '#61B8A6', label: 'E' },
  { start: -144, end: -108, color: '#66C0AF', label: 'D' },
  { start: -108, end: -72, color: '#6CC8B8', label: 'C' },
  { start: -72, end: -36, color: '#73D1C1', label: 'B' },
  { start: -36, end: 0, color: '#7AD9C9', label: 'A' },
]

const polar = (angleDeg: number, r: number) => {
  const a = (Math.PI / 180) * angleDeg
  return { x: 100 + r * Math.cos(a), y: 120 + r * Math.sin(a) }
}
const makePath = (s: number, e: number, rOuter: number, rInner: number) => {
  const p1 = polar(s, rOuter)
  const p2 = polar(e, rOuter)
  const p3 = polar(e, rInner)
  const p4 = polar(s, rInner)
  const large = e - s > 180 ? 1 : 0
  return [
    `M ${p1.x} ${p1.y}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${p4.x} ${p4.y}`,
    'Z',
  ].join(' ')
}

const letterPositions = computed(() =>
  sectors.map((s) => {
    const mid = (s.start + s.end) / 2
    const p = polar(mid, 78)
    return { ...s, x: p.x, y: p.y }
  }),
)

const grade = 'A'
const learned = 81
const notLearned = 321

const go = (r?: string) => r && router.push(r)
</script>

<template>
  <div class="p-6">
    <div class="grid grid-cols-3 gap-6">
      <!-- 左列 -->
      <div class="col-span-2 space-y-6">
        <!-- 练习中心 -->
        <section>
          <h2 class="text-[16px] font-600 text-[#2B2F36] mb-4">练习中心</h2>
          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="(c, i) in centerList"
              :key="c.zh"
              class="rounded-xl bg-white p-6 shadow-[0_6px_24px_rgba(2,6,23,0.06)] flex items-center gap-4 transition-all duration-200 ease-out hover:shadow-lg hover:scale-101 hover:z-10"
              :class="c.route ? 'cursor-pointer' : 'cursor-default'"
              @click="go(c.route)"
            >
              <div class="w-[60px] h-[60px]">
                <!-- 第一张 -->
                <svg v-if="i === 0" width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="60" height="60" rx="10" fill="#E6F6FF"/>
                  <rect width="45" height="45" transform="translate(7.5 7.5)" fill="#E6F6FF"/>
                  <path d="M39.8711 24.0454H44.9847C45.5272 24.0454 46.0475 24.2561 46.4311 24.6312C46.8147 25.0063 47.0302 25.515 47.0302 26.0454V28.1254C47.0302 28.6558 46.8147 29.1646 46.4311 29.5396C46.0475 29.9147 45.5272 30.1254 44.9847 30.1254H39.8711V24.0454ZM39.8711 32.1274H44.9847C45.5272 32.1274 46.0475 32.3381 46.4311 32.7132C46.8147 33.0883 47.0302 33.597 47.0302 34.1274V36.2074C47.0302 36.7378 46.8147 37.2466 46.4311 37.6216C46.0475 37.9967 45.5272 38.2074 44.9847 38.2074H39.8711V32.1274Z" fill="#82B0FF"/>
                  <path d="M12.5 24.25C12.5 22.1283 13.362 20.0934 14.8964 18.5931C16.4308 17.0929 18.5119 16.25 20.6818 16.25H36.0739C38.2438 16.25 40.3249 17.0929 41.8593 18.5931C43.3937 20.0934 44.2557 22.1283 44.2557 24.25V38.57C44.2557 40.6917 43.3937 42.7266 41.8593 44.2269C40.3249 45.7271 38.2438 46.57 36.0739 46.57H20.6818C18.5119 46.57 16.4308 45.7271 14.8964 44.2269C13.362 42.7266 12.5 40.6917 12.5 38.57V24.25Z" fill="url(#paint0_linear_1131_8826)" fill-opacity="0.7"/>
                  <path d="M29.79 24.8L34.39 37.62C34.4567 37.7933 34.49 37.9733 34.49 38.16C34.49 38.5067 34.37 38.8 34.13 39.04C33.89 39.28 33.5833 39.4 33.21 39.4C32.6233 39.36 32.2233 39.0533 32.01 38.48L30.85 34.98H24.97L23.81 38.48C23.5967 39.0533 23.1967 39.36 22.61 39.4C22.25 39.4 21.9433 39.2733 21.69 39.02C21.45 38.78 21.33 38.4933 21.33 38.16C21.33 37.9733 21.3633 37.7933 21.43 37.62L25.97 24.82C26.1167 24.4067 26.3633 24.08 26.71 23.84C27.07 23.5867 27.4567 23.46 27.87 23.46C28.2967 23.46 28.6833 23.5867 29.03 23.84C29.39 24.08 29.6433 24.4 29.79 24.8ZM27.91 26.04L25.73 32.64H30.09L27.91 26.04Z" fill="white"/>
                  <defs>
                    <linearGradient id="paint0_linear_1131_8826" x1="27.8964" y1="20.8442" x2="27.8964" y2="46.57" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#54C1FF"/>
                      <stop offset="1" stop-color="#52C0FF"/>
                    </linearGradient>
                  </defs>
                </svg>

                <!-- 第二张 -->
                <svg v-else-if="i === 1" width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="60" height="60" rx="10" fill="#FFFBE7"/>
                  <path d="M18.1367 34.5715H41.864L38.6189 43.7403C38.0544 45.3348 37.0095 46.7151 35.6282 47.6913C34.2469 48.6675 32.5969 49.1916 30.9055 49.1914H29.0952C27.4038 49.1916 25.7538 48.6675 24.3725 47.6913C22.9912 46.7151 21.9464 45.3348 21.3818 43.7403L18.1367 34.5726V34.5715Z" fill="url(#paint0_linear_1131_8852)"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M29.9995 43.9003C39.0383 43.9003 46.3652 36.5735 46.3652 27.5346C46.3652 18.4958 39.0383 11.1689 29.9995 11.1689C20.9606 11.1689 13.6338 18.4958 13.6338 27.5346C13.6338 36.5735 20.9606 43.9003 29.9995 43.9003Z" fill="url(#paint1_linear_1131_8852)"/>
                  <path d="M35.5959 25.116H24.4062C23.7107 25.116 23.1861 25.8523 23.3211 26.6449C23.9347 30.2726 26.693 33.0094 30.0015 33.0094C33.3111 33.0094 36.0684 30.2726 36.683 26.6449C36.816 25.8534 36.2923 25.116 35.5959 25.116Z" fill="white"/>
                  <defs>
                    <linearGradient id="paint0_linear_1131_8852" x1="30.0004" y1="34.5726" x2="30.0004" y2="43.6881" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#508AFE" stop-opacity="0.3"/>
                      <stop offset="1" stop-color="#508AFE"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_1131_8852" x1="29.9995" y1="20.6149" x2="29.9995" y2="48.1978" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#FFD600"/>
                      <stop offset="1" stop-color="#FFD800" stop-opacity="0.6"/>
                    </linearGradient>
                  </defs>
                </svg>

                <!-- 第三张 -->
                <svg v-else-if="i === 2" width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="60" height="60" rx="10" fill="#F3EEFF"/>
                  <path d="M34.2188 15.9375H25.7812C23.9691 15.9375 22.5 17.4066 22.5 19.2188C22.5 21.0309 23.9691 22.5 25.7812 22.5H34.2188C36.0309 22.5 37.5 21.0309 37.5 19.2188C37.5 17.4066 36.0309 15.9375 34.2188 15.9375Z" fill="#FD95E3"/>
                  <path d="M36.8297 19.6875H23.4375C20.3309 19.6875 17.8125 22.2059 17.8125 25.3125V38.5453C17.8125 41.6519 20.3309 44.1703 23.4375 44.1703H36.8297C39.9363 44.1703 42.4547 41.6519 42.4547 38.5453V25.3125C42.4547 22.2059 39.9363 19.6875 36.8297 19.6875Z" fill="url(#paint0_linear_1131_8839)" fill-opacity="0.85"/>
                  <path d="M26.5176 30.281L29.4491 32.4814L34.4863 27.4695" stroke="white" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round"/>
                  <defs>
                    <linearGradient id="paint0_linear_1131_8839" x1="30.1336" y1="13.2486" x2="30.1336" y2="36.4225" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#9369FF" stop-opacity="0.85"/>
                      <stop offset="1" stop-color="#9369FF"/>
                    </linearGradient>
                  </defs>
                </svg>

                <!-- 第四张 -->
                <svg v-else width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="60" height="60" rx="10" fill="#EAFFF7"/>
                  <path d="M20.625 35.0391C20.625 34.7904 20.7238 34.552 20.8996 34.3761C21.0754 34.2003 21.3139 34.1016 21.5625 34.1016H28.125C28.3736 34.1016 28.6121 34.2003 28.7879 34.3761C28.9637 34.552 29.0625 34.7904 29.0625 35.0391V46.7212C29.0625 46.8774 29.0235 47.0312 28.949 47.1685C28.8745 47.3058 28.7669 47.4223 28.636 47.5074C28.505 47.5925 28.3549 47.6436 28.1992 47.6559C28.0434 47.6683 27.8871 47.6415 27.7444 47.5781L25.2244 46.4587C25.1045 46.4055 24.9749 46.378 24.8438 46.378C24.7126 46.378 24.583 46.4055 24.4631 46.4587L21.9431 47.5781C21.8004 47.6415 21.6441 47.6683 21.4883 47.6559C21.3326 47.6436 21.1825 47.5925 21.0515 47.5074C20.9206 47.4223 20.813 47.3058 20.7385 47.1685C20.664 47.0312 20.625 46.8774 20.625 46.7212V35.0391Z" fill="#FFDA56"/>
                  <path d="M23.9166 14.292C18.9572 14.7954 15.9375 16.6714 15.9375 22.0864V33.5867C15.9375 39.5332 17.3409 42.7761 22.3659 42.7761H35.0569C40.0819 42.7761 42.3525 40.0798 42.3525 34.1332V22.0873C42.3525 16.6723 38.1506 14.2929 33.5475 14.2929H23.9156L23.9166 14.292Z" fill="#00D886" fill-opacity="0.66"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M28.5953 32.8395C27.9841 32.9633 26.7897 32.8395 26.1231 31.8139C25.5719 30.9645 25.2344 29.8808 25.2344 28.5139C25.2344 27.148 25.5606 26.082 26.1231 25.242C26.8037 24.2276 27.9841 24.1039 28.5953 24.2276C30.565 24.6251 33.0559 26.803 33.0559 28.5139C33.0559 30.2258 30.565 32.442 28.5953 32.8395Z" fill="white"/>
                </svg>
              </div>
              <div class="flex-1">
                <div class="text-[16px] font-700 text-[#2B2F36]">{{ c.zh }}</div>
                <div class="text-[12px] text-[#7B8794] mt-1">{{ c.en }}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- 快速练习 -->
        <section>
          <h2 class="text-[16px] font-600 text-[#2B2F36] mb-4">快速练习</h2>
          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="(q,i) in quickList"
              :key="q.zh"
              class="rounded-2xl bg-white p-6 shadow-[0_6px_24px_rgba(2,6,23,0.06)] flex items-center gap-4 transition-all duration-200 ease-out hover:shadow-lg hover:scale-101 hover:z-10 cursor-default"
            >
              <div class="w-[60px] h-[60px]">
                <!-- 1. 音标练习 -->
                <svg v-if="i===0" width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="60" height="60" rx="10" fill="#FFF8E2"/>
                  <path d="M14.2197 29.745C13.7469 28.2102 13.8958 26.551 14.6343 25.1249C15.3729 23.6988 16.642 22.6198 18.1683 22.1204L35.1264 16.5701C39.5977 15.1062 44.2384 18.2882 44.4854 22.986L44.9325 31.4937C45.0405 33.5484 44.3689 35.5681 43.052 37.149C41.7351 38.7299 39.87 39.7555 37.8296 40.0207L25.0028 41.6887C23.0922 41.937 21.1553 41.5017 19.5345 40.4599C17.9138 39.4181 16.7135 37.8368 16.1461 35.9955L14.2197 29.747V29.745Z" fill="#FFBB56"/>
                  <path d="M42.0666 18.0709H20.9691C18.7139 18.0709 16.8857 19.8991 16.8857 22.1543V39.6973C16.8857 41.9524 18.7139 43.7806 20.9691 43.7806H42.0666C44.3218 43.7806 46.15 41.9524 46.15 39.6973V22.1543C46.15 19.8991 44.3218 18.0709 42.0666 18.0709Z" fill="url(#paint0_linear_1131_8891)" fill-opacity="0.7"/>
                  <path d="M30.6909 23.8099C32.1501 23.8221 33.2262 24.1504 33.9194 24.7949C34.649 25.4758 35.0138 26.5581 35.0138 28.0416V33.6777C35.0138 33.9817 34.9104 34.2371 34.7037 34.4438C34.497 34.6505 34.2416 34.7539 33.9376 34.7539C33.6458 34.7539 33.3904 34.6445 33.1715 34.4256C32.9648 34.2189 32.8614 33.9696 32.8614 33.6777V33.3494C32.0832 34.4073 30.8064 34.9363 29.031 34.9363C27.9731 34.9363 27.1402 34.6627 26.5322 34.1155C25.9242 33.5683 25.6202 32.7901 25.6202 31.7808C25.6202 30.8566 25.9181 30.0845 26.5139 29.4643C27.1584 28.7955 28.0522 28.4003 29.1952 28.2787C30.4477 28.1328 31.6576 28.1024 32.825 28.1875V27.8227C32.825 26.5702 32.0832 25.944 30.5997 25.944C29.6026 25.944 28.6662 26.1081 27.7907 26.4365C27.5354 26.5337 27.3347 26.5824 27.1888 26.5824C26.9091 26.5824 26.6659 26.479 26.4592 26.2723C26.2525 26.0656 26.1491 25.8224 26.1491 25.5427C26.1491 25.1171 26.3802 24.7888 26.8422 24.5577C28.0218 24.0713 29.3046 23.8221 30.6909 23.8099ZM29.5418 32.8022C30.5754 32.8022 31.3779 32.5712 31.9494 32.1091C32.521 31.647 32.8128 31.0086 32.825 30.1939C31.3658 30.1331 30.2592 30.1453 29.5053 30.2304C28.9459 30.279 28.5264 30.4432 28.2467 30.7229C28.0035 30.9539 27.8819 31.2579 27.8819 31.6349C27.8819 32.4131 28.4352 32.8022 29.5418 32.8022Z" fill="white"/>
                  <defs>
                    <linearGradient id="paint0_linear_1131_8891" x1="40.1944" y1="41.1091" x2="20.7047" y2="22.632" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#FFD600"/>
                      <stop offset="1" stop-color="#FFD700" stop-opacity="0.79"/>
                    </linearGradient>
                  </defs>
                </svg>

                <!-- 2. 短语练习 -->
                <svg v-else-if="i===1" width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="60" height="60" rx="10" fill="#DEF3FF"/>
                  <path opacity="0.4" d="M27.8008 18.5129H31.1692V41.7433H27.8008V18.5129Z" fill="#22AFFE"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M20.915 16.875C19.4232 16.875 17.9925 17.4676 16.9376 18.5225C15.8827 19.5774 15.29 21.0082 15.29 22.5V37.5C15.29 38.9919 15.8827 40.4226 16.9376 41.4775C17.9925 42.5324 19.4232 43.125 20.915 43.125H24.606C25.445 43.125 26.241 42.9413 26.9563 42.6122C28.3822 41.9559 30.9688 41.9559 32.3947 42.6122C33.1321 42.9514 33.9343 43.1264 34.746 43.125H38.4369C39.9288 43.125 41.3595 42.5324 42.4144 41.4775C43.4693 40.4226 44.0619 38.9919 44.0619 37.5V22.5C44.0619 21.0082 43.4693 19.5774 42.4144 18.5225C41.3595 17.4676 39.9288 16.875 38.4369 16.875H34.745C33.906 16.875 33.11 17.0588 32.3947 17.3878C30.9697 18.0441 28.3822 18.0441 26.9572 17.3878C26.2196 17.0485 25.417 16.8735 24.605 16.875H20.915Z" fill="url(#paint0_linear_1131_8878)" fill-opacity="0.7"/>
                  <path d="M32.2531 30.3163C31.2368 31.3738 30.2731 32.1876 29.4031 32.7651C29.1125 32.9713 28.7093 32.8541 28.5134 32.556C28.0568 31.8623 27.4231 31.4188 26.6384 31.1179L26.6271 31.1132C26.1921 30.9491 25.8987 30.4129 26.1509 30.0219C26.6722 29.1519 27.4334 28.1704 28.4478 27.1138C31.4103 24.0313 35.0309 21.8638 36.0818 22.7488C37.1318 23.6329 35.2146 27.2338 32.2531 30.3163ZM23.4387 32.7154C23.8493 31.9288 24.9172 31.7948 25.6493 32.0591C26.5043 32.3685 27.1568 32.9076 27.5684 33.9088C27.8121 34.6082 27.5693 35.0994 27.0209 35.5935C26.1331 36.3941 25.1215 36.7654 23.9609 36.7823C21.6865 36.8141 21.5815 35.1013 22.309 34.6448C23.1584 34.1113 23.0515 33.456 23.4387 32.7154Z" fill="white"/>
                  <defs>
                    <linearGradient id="paint0_linear_1131_8878" x1="29.5738" y1="20.8519" x2="29.5738" y2="43.125" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#34B5FF"/>
                      <stop offset="0.998" stop-color="#33B5FF"/>
                    </linearGradient>
                  </defs>
                </svg>

                <!-- 3. 语法练习 -->
                <svg v-else-if="i===2" width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="60" height="60" rx="10" fill="#EAFFF7"/>
                  <path d="M26.1127 41.0511C24.1515 41.5761 23.1699 41.8396 22.1002 41.7149C20.7662 41.5583 19.2034 40.693 18.3643 39.644C17.6912 38.804 17.4296 37.9499 16.9065 36.2427C16.5235 34.9883 16.165 33.7265 15.8312 32.458C15.5059 31.2261 15.2312 30.1049 14.9968 29.0943C14.5993 27.3693 14.4005 26.5077 14.5712 25.4286C14.7774 24.1293 15.6924 22.6049 16.7443 21.8136C17.6162 21.1574 18.5884 20.8958 20.5337 20.3746C23.0621 19.6977 24.3268 19.3583 25.4349 19.5036C26.168 19.6 26.8749 19.84 27.5151 20.2098C28.1554 20.5797 28.7164 21.0721 29.1662 21.659C29.8468 22.5458 30.1852 23.8105 30.863 26.339L32.0499 30.7677C32.7184 33.2615 33.053 34.5083 32.9152 35.6024C32.8216 36.3461 32.5804 37.0636 32.2056 37.7127C31.8308 38.3619 31.33 38.9295 30.7327 39.3824C29.8543 40.048 28.6074 40.3827 26.1127 41.0511Z" fill="#85EEC6"/>
                  <path d="M25.2 43.8066C21.9375 43.5535 19.3969 41.055 19.0875 37.7982C18.9 35.8294 18.75 33.4622 18.75 30.9375C18.75 28.4128 18.9 26.0457 19.0875 24.0769C19.3969 20.82 21.9375 18.3207 25.2 18.0694C29.6435 17.7282 34.1065 17.7282 38.55 18.0694C41.8125 18.3207 44.3531 20.82 44.6625 24.0769C44.85 26.0457 45 28.4128 45 30.9375C45 33.4622 44.85 35.8294 44.6625 37.7982C44.3531 41.055 41.8125 43.5544 38.55 43.8066C34.1065 44.1479 29.6435 44.1479 25.2 43.8066Z" fill="#00D886" fill-opacity="0.66"/>
                </svg>

                <!-- 4. 阅读练习 -->
                <svg v-else-if="i===3" width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 10C0 4.47715 4.47715 0 10 0H50C55.5228 0 60 4.47715 60 10V50C60 55.5228 55.5228 60 50 60H10C4.47715 60 0 55.5228 0 50V10Z" fill="#F3EEFF"/>
                  <path d="M39.8701 22.9042H44.9838C45.5262 22.9042 46.0465 23.1197 46.4301 23.5033C46.8137 23.8869 47.0292 24.4071 47.0292 24.9496V27.0769C47.0292 27.6194 46.8137 28.1397 46.4301 28.5233C46.0465 28.9069 45.5262 29.1224 44.9838 29.1224H39.8701V22.9042ZM39.8701 31.1699H44.9838C45.5262 31.1699 46.0465 31.3854 46.4301 31.769C46.8137 32.1526 47.0292 32.6728 47.0292 33.2153V35.3426C47.0292 35.8851 46.8137 36.4053 46.4301 36.7889C46.0465 37.1725 45.5262 37.388 44.9838 37.388H39.8701V31.1699Z" fill="#FD95E3"/>
                  <path d="M12.7168 23.9266C12.7168 21.7566 13.5788 19.6755 15.1132 18.1411C16.6476 16.6068 18.7287 15.7448 20.8986 15.7448H36.2907C38.4606 15.7448 40.5417 16.6068 42.0761 18.1411C43.6105 19.6755 44.4725 21.7566 44.4725 23.9266V38.572C44.4725 40.742 43.6105 42.8231 42.0761 44.3574C40.5417 45.8918 38.4606 46.7538 36.2907 46.7538H20.8986C18.7287 46.7538 16.6476 45.8918 15.1132 44.3574C13.5788 42.8231 12.7168 40.742 12.7168 38.572V23.9266Z" fill="url(#paint0_linear_1131_8905)" fill-opacity="0.85"/>
                  <path d="M21.4355 28.1019C21.4355 27.2881 21.7588 26.5077 22.3342 25.9323C22.9096 25.3569 23.69 25.0337 24.5037 25.0337H32.6855C33.4993 25.0337 34.2797 25.3569 34.8551 25.9323C35.4305 26.5077 35.7537 27.2881 35.7537 28.1019V32.1928C35.7537 33.0065 35.4305 33.7869 34.8551 34.3623C34.2797 34.9377 33.4993 35.261 32.6855 35.261H24.5037C23.69 35.261 22.9096 34.9377 22.3342 34.3623C21.7588 33.7869 21.4355 33.0065 21.4355 32.1928V28.1019Z" fill="white"/>
                  <defs>
                    <linearGradient id="paint0_linear_1131_8905" x1="28.5946" y1="7.58952" x2="28.5946" y2="36.9408" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#9369FF" stop-opacity="0.85"/>
                      <stop offset="1" stop-color="#9369FF"/>
                    </linearGradient>
                  </defs>
                </svg>

                <!-- 5. 口语训练 -->
                <svg v-else width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="60" height="60" rx="10" fill="#FFF5DC"/>
                  <path d="M47.4733 30.0476C47.4733 28.4202 46.8268 26.8593 45.676 25.7086C44.5252 24.5578 42.9644 23.9113 41.3369 23.9113H30.9123C28.7423 23.9113 26.6613 24.7733 25.1269 26.3077C23.5925 27.842 22.7305 29.9231 22.7305 32.0931V39.5743C22.7305 40.6913 23.1742 41.7625 23.964 42.5524C24.7538 43.3422 25.8251 43.7859 26.9421 43.7859H37.1785C38.0632 43.7859 38.9254 44.0641 39.6433 44.5826L42.6092 46.7242C44.6383 48.1888 47.4733 46.7395 47.4733 44.2369V30.0476Z" fill="url(#paint0_linear_1131_8931)"/>
                  <g filter="url(#filter0_d_1131_8931)">
                    <path d="M12.5264 24.0063C12.5264 21.8363 13.3884 19.7552 14.9228 18.2209C16.4572 16.6865 18.5383 15.8245 20.7082 15.8245H35.2657C37.4357 15.8245 39.5168 16.6865 41.0512 18.2209C42.5855 19.7552 43.4475 21.8363 43.4475 24.0063V30.473C43.4475 32.6429 42.5855 34.724 41.0512 36.2584C39.5168 37.7928 37.4357 38.6548 35.2657 38.6548H25.512C23.7427 38.6548 22.0173 39.2122 20.5824 40.2482L17.3895 42.5534C15.3604 44.018 12.5254 42.5678 12.5254 40.0651L12.5264 24.0063Z" fill="url(#paint1_linear_1131_8931)"/>
                  </g>
                  <path d="M31.0551 24.1749H24.9188C23.2243 24.1749 21.8506 25.5486 21.8506 27.2431C21.8506 28.9376 23.2243 30.3113 24.9188 30.3113H31.0551C32.7496 30.3113 34.1233 28.9376 34.1233 27.2431C34.1233 25.5486 32.7496 24.1749 31.0551 24.1749Z" fill="white"/>
                  <defs>
                    <filter id="filter0_d_1131_8931" x="8.3138" y="12.6653" width="39.3451" height="35.7379" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset dy="1.05239"/>
                      <feGaussianBlur stdDeviation="2.1058"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.909167 0 0 0 0 0.0916666 0 0 0 0.05 0"/>
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1131_8931"/>
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1131_8931" result="shape"/>
                    </filter>
                    <linearGradient id="paint0_linear_1131_8931" x1="35.1024" y1="35.1255" x2="26.761" y2="23.9113" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#FF624D"/>
                      <stop offset="1" stop-color="#FF624D" stop-opacity="0"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_1131_8931" x1="27.987" y1="15.8245" x2="27.987" y2="46.0645" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#FFD600"/>
                      <stop offset="1" stop-color="#FFD700" stop-opacity="0.6"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div class="flex-1">
                <div class="text-[16px] font-700 text-[#2B2F36]">{{ q.zh }}</div>
                <div class="text-[12px] text-[#7B8794] mt-1">{{ q.en }}</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- 右列 -->
      <div class="col-span-1 space-y-6">
        <!-- 个人卡片 -->
        <section class="rounded-2xl bg-white p-6 shadow-[0_6px_24px_rgba(2,6,23,0.06)]">
          <div class="flex items-center justify-center">
            <div class="w-[84px] h-[84px] rounded-full bg-[#DCEFEA] flex items-center justify-center">
              <i class="i-ph:user-duotone text-[30px] text-[#1F7A6D]" />
            </div>
          </div>
          <div class="text-center mt-4">
            <div class="text-[16px] font-700 text-[#2B2F36]">小鹿还能学</div>
            <div class="text-[12px] text-[#7B8794] mt-1">江苏大学</div>
          </div>
          <div class="grid grid-cols-2 mt-6">
            <div class="text-center">
              <div class="text-[12px] text-[#7B8794]">可用课时</div>
              <div class="text-[28px] font-700 text-[#2B2F36]">799</div>
            </div>
            <div class="text-center">
              <div class="text-[12px] text-[#7B8794]">已用课时</div>
              <div class="text-[28px] font-700 text-[#2B2F36]">141</div>
            </div>
          </div>
        </section>

        <!-- 报告 -->
        <section class="rounded-2xl bg-white p-6 shadow-[0_6px_24px_rgba(2,6,23,0.06)]">
          <div class="text-[14px] font-600 text-[#2B2F36] mb-4">学习进度个性化报告</div>
          <div class="flex items-center justify-center">
            <svg viewBox="0 0 200 140" class="w-[320px] h-[208px]">
              <g>
                <template v-for="s in sectors" :key="s.start">
                  <path :d="makePath(s.start, s.end, 90, 60)" :fill="s.color" />
                </template>
              </g>
              <template v-for="p in letterPositions" :key="p.label">
                <text :x="p.x" :y="p.y" text-anchor="middle" style="font-size:12px; font-weight:700" class="fill-white">{{ p.label }}</text>
              </template>
              <g transform="translate(100,120)">
                <polygon points="0,-50 7,-35 -7,-35" fill="#F04438" />
              </g>
              <circle cx="100" cy="120" r="34" fill="#fff" />
              <text x="100" y="118" text-anchor="middle" style="font-size:26px; font-weight:800" class="fill-[#124B40]">{{ grade }}</text>
              <text x="100" y="136" text-anchor="middle" style="font-size:12px" class="fill-[#7B8794]">等级评定</text>
            </svg>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-2">
            <div class="text-center">
              <div class="text-[12px] text-[#7B8794]">未学</div>
              <div class="text-[20px] font-700 text-[#2B2F36]">{{ notLearned }}</div>
            </div>
            <div class="text-center">
              <div class="text-[12px] text-[#7B8794]">已学</div>
              <div class="text-[20px] font-700 text-[#2B2F36]">{{ learned }}</div>
            </div>
          </div>
          <div class="mt-4 text-[12px] text-[#98A2B3] leading-6">
            <div class="flex items-center gap-1">
              <i class="i-carbon:locked text-[#98A2B3]" />
              <span>说明</span>
            </div>
            <div>
              评定等级根据学习情况和出勤情况的综合评定定为 A、B、C、D、E 等级，占人群比例 20% 逐级递增，其中 A 为优秀，B 为较优，C 为较好，D 为较差，E 为差。
            </div>
            <div class="text-[10px] text-[#C4CDD5] mt-2">* 评定数据仅供参考，对结果不承担法律责任。</div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
