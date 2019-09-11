module.exports = [
  {
    content: {
      _id: '5abd06d4987d78001c38d8a8',
      userId: '5931587111aa953900e32c10',
      content: {ref: 'mod_4JGW7S08E', type: 'level', version: '1'},
      __v: 3,
      meta: {updatedAt: '2018-03-29T15:31:53.849Z', createdAt: '2018-03-29T15:31:32.534Z'},
      engineOptions: {livesDisabled: false},
      actions: [
        {
          _id: '5abd06d4987d78001c38d8a9',
          type: 'move',
          createdAt: '2018-03-29T15:31:32.534Z',
          payload: {nextContent: {type: 'slide', ref: 'sli_E17GYmTvN'}, instructions: null}
        },
        {
          type: 'answer',
          createdAt: '2018-03-29T15:31:40.903Z',
          payload: {
            content: {ref: 'sli_E17GYmTvN', type: 'slide'},
            nextContent: {ref: 'sli_NJWz27pP4', type: 'slide'},
            isCorrect: true,
            godMode: false,
            instructions: null,
            answer: ['chaîne de valeur']
          }
        },
        {
          type: 'answer',
          createdAt: '2018-03-29T15:31:46.950Z',
          payload: {
            content: {ref: 'sli_NJWz27pP4', type: 'slide'},
            nextContent: {ref: 'sli_NySkoX6PV', type: 'slide'},
            isCorrect: false,
            godMode: false,
            instructions: null,
            answer: [
              'Leurs réseaux ouverts ',
              'Le potentiel de création de valeur ',
              'Les taxes réduites pour les partenaires'
            ]
          }
        },
        {
          type: 'answer',
          createdAt: '2018-03-29T15:31:53.849Z',
          payload: {
            content: {ref: 'sli_NySkoX6PV', type: 'slide'},
            nextContent: {ref: 'sli_4JZTVG6P4', type: 'slide'},
            isCorrect: false,
            godMode: false,
            instructions: null,
            answer: [
              'Ce sont des systèmes reliant une multitude d’individus, d’objets et d’informations les uns aux autres'
            ]
          }
        }
      ],
      engine: {ref: 'learner', version: '1'},
      state: {
        livesDisabled: false,
        isCorrect: false,
        slides: ['sli_E17GYmTvN', 'sli_NJWz27pP4', 'sli_NySkoX6PV'],
        lives: 1,
        step: {current: 14},
        stars: 4,
        requestedClues: [],
        viewedResources: [],
        remainingLifeRequests: 1,
        hasViewedAResourceAtThisStep: false,
        content: {ref: 'sli_NySkoX6PV', type: 'slide'},
        nextContent: {ref: 'sli_4JZTVG6P4', type: 'slide'},
        allAnswers: [
          {slideRef: 'sli_E17GYmTvN', isCorrect: true, answer: ['chaîne de valeur']},
          {
            slideRef: 'sli_NJWz27pP4',
            isCorrect: false,
            answer: [
              'Leurs réseaux ouverts ',
              'Le potentiel de création de valeur ',
              'Les taxes réduites pour les partenaires'
            ]
          },
          {
            slideRef: 'sli_NySkoX6PV',
            isCorrect: false,
            answer: [
              'Ce sont des systèmes reliant une multitude d’individus, d’objets et d’informations les uns aux autres'
            ]
          }
        ],
        variables: {}
      }
    }
  },
  {
    content: {
      _id: '5abd069d987d78001c38d89c',
      userId: '5931587111aa953900e32c10',
      content: {ref: 'mod_4JGW7S08E', type: 'level', version: '1'},
      __v: 5,
      meta: {updatedAt: '2018-03-29T15:31:29.636Z', createdAt: '2018-03-29T15:30:37.618Z'},
      engineOptions: {livesDisabled: false},
      actions: [
        {
          _id: '5abd069d987d78001c38d89d',
          type: 'move',
          createdAt: '2018-03-29T15:30:37.618Z',
          payload: {nextContent: {type: 'slide', ref: 'sli_VkqYwQawE'}, instructions: null}
        },
        {
          type: 'answer',
          createdAt: '2018-03-29T15:30:53.132Z',
          payload: {
            content: {ref: 'sli_VkqYwQawE', type: 'slide'},
            nextContent: {ref: 'sli_E17GYmTvN', type: 'slide'},
            isCorrect: false,
            godMode: false,
            instructions: null,
            answer: ['La valeur est capturée et créée sans interruption']
          }
        },
        {
          type: 'answer',
          createdAt: '2018-03-29T15:31:02.322Z',
          payload: {
            content: {ref: 'sli_E17GYmTvN', type: 'slide'},
            nextContent: {ref: 'sli_4kQ5af6P4', type: 'slide'},
            isCorrect: true,
            godMode: false,
            instructions: null,
            answer: ['chaîne de valeur']
          }
        },
        {
          type: 'answer',
          createdAt: '2018-03-29T15:31:11.470Z',
          payload: {
            content: {ref: 'sli_4kQ5af6P4', type: 'slide'},
            nextContent: {ref: 'sli_NJWz27pP4', type: 'slide'},
            isCorrect: false,
            godMode: false,
            instructions: null,
            answer: ['de réseau']
          }
        },
        {
          type: 'answer',
          createdAt: '2018-03-29T15:31:26.378Z',
          payload: {
            content: {ref: 'sli_NJWz27pP4', type: 'slide'},
            nextContent: {ref: 'extraLife', type: 'node'},
            isCorrect: false,
            godMode: false,
            instructions: null,
            answer: [
              'Leurs réseaux ouverts ',
              'Le potentiel de création de valeur ',
              'Les taxes réduites pour les partenaires'
            ]
          }
        },
        {
          type: 'extraLifeRefused',
          createdAt: '2018-03-29T15:31:29.636Z',
          payload: {
            content: {ref: 'extraLife', type: 'node'},
            nextContent: {ref: 'failExitNode', type: 'failure'},
            instructions: null
          }
        }
      ],
      engine: {ref: 'learner', version: '1'},
      state: {
        livesDisabled: false,
        isCorrect: false,
        slides: ['sli_VkqYwQawE', 'sli_E17GYmTvN', 'sli_4kQ5af6P4', 'sli_NJWz27pP4'],
        lives: 0,
        step: {current: 5},
        stars: 4,
        requestedClues: [],
        viewedResources: [],
        remainingLifeRequests: 1,
        hasViewedAResourceAtThisStep: false,
        content: {ref: 'extraLife', type: 'node'},
        nextContent: {ref: 'failExitNode', type: 'failure'},
        allAnswers: [
          {
            slideRef: 'sli_VkqYwQawE',
            isCorrect: false,
            answer: ['La valeur est capturée et créée sans interruption']
          },
          {slideRef: 'sli_E17GYmTvN', isCorrect: true, answer: ['chaîne de valeur']},
          {slideRef: 'sli_4kQ5af6P4', isCorrect: false, answer: ['de réseau']},
          {
            slideRef: 'sli_NJWz27pP4',
            isCorrect: false,
            answer: [
              'Leurs réseaux ouverts ',
              'Le potentiel de création de valeur ',
              'Les taxes réduites pour les partenaires'
            ]
          }
        ],
        variables: {}
      }
    }
  },
  {
    content: {
      _id: '5abd069d987d78001c38d89c2',
      userId: '5931587111aa953900e32c10',
      content: {ref: 'mod_4JGW7S08E', type: 'level', version: '1'},
      __v: 5,
      meta: {updatedAt: '2018-03-13T15:13:29.636Z', createdAt: '2018-03-29T15:30:37.618Z'},
      engineOptions: {livesDisabled: false},
      actions: [
        {
          _id: '5abd069d987d78001c38d89d2',
          type: 'move',
          createdAt: '2018-03-29T15:30:37.618Z',
          payload: {nextContent: {type: 'slide', ref: 'sli_VkqYwQawE'}, instructions: null}
        },
        {
          type: 'answer',
          createdAt: '2018-03-29T15:30:53.132Z',
          payload: {
            content: {ref: 'sli_VkqYwQawE', type: 'slide'},
            nextContent: {ref: 'sli_E17GYmTvN', type: 'slide'},
            isCorrect: true,
            godMode: false,
            instructions: null,
            answer: ['La valeur est capturée et créée sans interruption']
          }
        },
        {
          type: 'answer',
          createdAt: '2018-03-29T15:31:02.322Z',
          payload: {
            content: {ref: 'sli_E17GYmTvN', type: 'slide'},
            nextContent: {ref: 'sli_4kQ5af6P4', type: 'slide'},
            isCorrect: true,
            godMode: false,
            instructions: null,
            answer: ['chaîne de valeur']
          }
        },
        {
          type: 'answer',
          createdAt: '2018-03-29T15:31:11.470Z',
          payload: {
            content: {ref: 'sli_4kQ5af6P4', type: 'slide'},
            nextContent: {ref: 'sli_NJWz27pP4', type: 'slide'},
            isCorrect: true,
            godMode: false,
            instructions: null,
            answer: ['de réseau']
          }
        },
        {
          type: 'answer',
          createdAt: '2018-03-29T15:31:26.378Z',
          payload: {
            content: {ref: 'sli_NJWz27pP4', type: 'slide'},
            nextContent: {ref: 'successExitNode', type: 'success'},
            isCorrect: true,
            godMode: false,
            instructions: null,
            answer: [
              'Leurs réseaux ouverts ',
              'Le potentiel de création de valeur ',
              'Les taxes réduites pour les partenaires'
            ]
          }
        }
      ],
      engine: {ref: 'learner', version: '1'},
      state: {
        livesDisabled: false,
        isCorrect: true,
        slides: ['sli_VkqYwQawE', 'sli_E17GYmTvN', 'sli_4kQ5af6P4', 'sli_NJWz27pP4'],
        lives: 0,
        step: {current: 25},
        stars: 4,
        requestedClues: [],
        viewedResources: [],
        remainingLifeRequests: 1,
        hasViewedAResourceAtThisStep: false,
        content: {ref: 'extraLife', type: 'node'},
        nextContent: {ref: 'successExitNode', type: 'success'},
        allAnswers: [
          {
            slideRef: 'sli_VkqYwQawE',
            isCorrect: true,
            answer: ['La valeur est capturée et créée sans interruption']
          },
          {slideRef: 'sli_E17GYmTvN', isCorrect: true, answer: ['chaîne de valeur']},
          {slideRef: 'sli_4kQ5af6P4', isCorrect: true, answer: ['de réseau']},
          {
            slideRef: 'sli_NJWz27pP4',
            isCorrect: true,
            answer: [
              'Leurs réseaux ouverts ',
              'Le potentiel de création de valeur ',
              'Les taxes réduites pour les partenaires'
            ]
          }
        ],
        variables: {}
      }
    }
  },
  {
    content: {
      _id: '5c18d95750ffcb0019108cec',
      userId: '0000000000000000000002be',
      content: {ref: 'cha_Ny1BTxRp~', type: 'chapter', version: '1'},
      __v: 1,
      meta: {updatedAt: '2018-12-18T11:26:15.780Z', createdAt: '2018-12-18T11:26:15.780Z'},
      actions: [
        {
          _id: '5c18d95750ffcb0019108ced',
          type: 'move',
          createdAt: '2018-12-18T11:26:15.780Z',
          payload: {nextContent: {type: 'slide', ref: 'sli_VkcAWR-ZQ'}, instructions: null}
        }
      ],
      engine: {ref: 'microlearning', version: '1'},
      state: {
        livesDisabled: false,
        isCorrect: true,
        slides: [],
        lives: 1,
        step: {current: 1},
        stars: 0,
        requestedClues: [],
        viewedResources: [],
        remainingLifeRequests: 1,
        hasViewedAResourceAtThisStep: false,
        nextContent: {type: 'slide', ref: 'sli_VkcAWR-ZQ'},
        allAnswers: [],
        variables: {}
      }
    }
  },
  {
    content: {
      _id: '5c18d95750ffcb0019108cec2',
      userId: '0000000000000000000002be',
      content: {ref: 'cha_Ny1BTxRp~', type: 'chapter', version: '1'},
      __v: 1,
      meta: {updatedAt: '2018-12-18T11:26:46.137Z', createdAt: '2018-12-18T11:26:15.780Z'},
      actions: [
        {
          _id: '5c18d95750ffcb0019108ced2a',
          type: 'move',
          createdAt: '2018-12-18T11:26:15.780Z',
          payload: {nextContent: {type: 'slide', ref: 'sli_VkcAWR-ZQ'}, instructions: null}
        },
        {
          type: 'answer',
          createdAt: '2018-12-18T11:26:46.137Z',
          payload: {
            content: {ref: 'sli_VkcAWR-ZQ', type: 'slide'},
            nextContent: {ref: 'sli_VktuuzFW7', type: 'slide'},
            isCorrect: true,
            godMode: false,
            instructions: null,
            answer: ['Bonne réponse']
          }
        }
      ],
      engine: {ref: 'microlearning', version: '1'},
      state: {
        livesDisabled: false,
        isCorrect: true,
        slides: ['sli_VkcAWR-ZQ'],
        lives: 1,
        step: {current: 2},
        stars: 4,
        requestedClues: [],
        viewedResources: [],
        remainingLifeRequests: 1,
        hasViewedAResourceAtThisStep: false,
        content: {ref: 'sli_VkcAWR-ZQ', type: 'slide'},
        nextContent: {ref: 'sli_VktuuzFW7', type: 'slide'},
        allAnswers: [{slideRef: 'sli_VkcAWR-ZQ', isCorrect: true, answer: ['Bonne réponse']}],
        variables: {}
      }
    }
  }
];
