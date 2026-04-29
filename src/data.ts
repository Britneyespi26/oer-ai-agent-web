import type { CourseOption, OerResource } from './types';

export const REQUIRED_COURSES: CourseOption[] = [
  {
    code: 'ARTS 1100',
    title: 'Art Appreciation',
    area: 'Arts & English',
    term: 'Fall 2025',
    sampleSyllabus:
      'Survey and theory of art throughout world history focused on analysis of art forms, technical procedures, subject matter, composition, theory, art philosophy, and cultural/social influences. Learning goals include visual literacy, cross-cultural comparison, and oral/written analysis of works of art.',
    sourceLinks: [
      {
        label: 'GGC Simple Syllabus Portal (search ARTS 1100)',
        url: 'https://ggc.simplesyllabus.com',
      },
      {
        label: 'GGC Catalog Course Description',
        url: 'https://catalog.ggc.edu/preview_course_nopop.php?catoid=45&coid=11685&print=',
      },
    ],
  },
  {
    code: 'ENGL 1101',
    title: 'First Semester Composition',
    area: 'Arts & English',
    term: 'Spring 2026',
    sampleSyllabus:
      'Composition course focused on effective writing across contexts with emphasis on exposition, analysis, argumentation, and introductory research skills. Typical modules include writing academically, audience awareness, source integration, MLA, revision, and argumentative writing.',
    sourceLinks: [
      {
        label: 'GGC Simple Syllabus Portal (search ENGL 1101)',
        url: 'https://ggc.simplesyllabus.com',
      },
      {
        label: 'GGC Catalog Course Description',
        url: 'https://catalog.ggc.edu/preview_course_nopop.php?catoid=33&coid=5677&print=',
      },
    ],
  },
  {
    code: 'ENGL 1102',
    title: 'Secondary Semester Composition',
    area: 'Arts & English',
    term: 'Fall 2025',
    sampleSyllabus:
      'Composition course advancing beyond ENGL 1101 with stronger emphasis on interpretation, evaluation, and advanced research methods. Typical units include literary analysis, evidence-based argument development, and iterative revision.',
    sourceLinks: [
      {
        label: 'GGC Simple Syllabus Portal (search ENGL 1102)',
        url: 'https://ggc.simplesyllabus.com',
      },
      {
        label: 'GGC Catalog Course Description',
        url: 'https://catalog.ggc.edu/preview_course_nopop.php?catoid=45&coid=11866&print=',
      },
    ],
  },
  {
    code: 'HIST 2111',
    title: 'American History 1',
    area: 'History',
    term: 'Fall 2025',
    sampleSyllabus:
      'Survey of United States History to the post-Civil War period, including colonial development, revolution, constitutional formation, early republic change, sectional conflict, and historical source interpretation.',
    sourceLinks: [
      {
        label: 'GGC Simple Syllabus Portal (search HIST 2111)',
        url: 'https://ggc.simplesyllabus.com',
      },
      {
        label: 'GGC Catalog Course Description',
        url: 'https://catalog.ggc.edu/preview_course_nopop.php?catoid=49&coid=18179&print=',
      },
    ],
  },
  {
    code: 'HIST 2112',
    title: 'American History 2',
    area: 'History',
    term: 'Spring 2026',
    sampleSyllabus:
      'Survey of United States History from the post-Civil War era to the present, including reconstruction, industrialization, world wars, civil rights, modern politics, and analysis of historical narratives.',
    sourceLinks: [
      {
        label: 'GGC Simple Syllabus Portal (search HIST 2112)',
        url: 'https://ggc.simplesyllabus.com',
      },
      {
        label: 'GGC Catalog Course Description',
        url: 'https://catalog.ggc.edu/preview_course_nopop.php?catoid=49&coid=18181&print=',
      },
    ],
  },
  {
    code: 'ITEC 1001',
    title: 'Introduction to Computing',
    area: 'Information Technology',
    term: 'Fall 2025',
    sampleSyllabus:
      'Introduction to computers and applications software. Outcomes include computing evolution, digital ethics, productivity tools, hardware fundamentals, security/privacy, collaboration tools, networking principles, and software system types.',
    sourceLinks: [
      {
        label: 'GGC Simple Syllabus Portal (search ITEC 1001)',
        url: 'https://ggc.simplesyllabus.com',
      },
      {
        label: 'GGC Catalog Course Description',
        url: 'https://catalog.ggc.edu/preview_course_nopop.php?catoid=37&coid=7777',
      },
    ],
  },
  {
    code: 'BIOL 1101K',
    title: 'Intro to Biology 1 with Lab',
    area: 'Biology',
    term: 'Fall 2025',
    sampleSyllabus:
      'Part of a two-semester biology sequence for non-science majors with laboratory. Outcomes include cellular-to-organism organization, scientific process, data collection/analysis, and communication of scientific topics with evidence-based reasoning.',
    sourceLinks: [
      {
        label: 'GGC Catalog Course Description',
        url: 'https://catalog.ggc.edu/preview_course_nopop.php?catoid=45&coid=11699',
      },
      {
        label: 'GGC Simple Syllabus Portal (search BIOL 1101K)',
        url: 'https://ggc.simplesyllabus.com',
      },
    ],
  },
  {
    code: 'BIOL 1102',
    title: 'Introduction to Biology 2',
    area: 'Biology',
    term: 'Spring 2026',
    sampleSyllabus:
      'Second course in the two-semester biology sequence for non-science majors. Outcomes emphasize organism-to-biosphere systems, scientific thinking, data interpretation, global biological issues, and oral/written scientific communication.',
    sourceLinks: [
      {
        label: 'GGC Simple Syllabus Portal (search BIOL 1102)',
        url: 'https://ggc.simplesyllabus.com',
      },
      {
        label: 'GGC Catalog Course Description',
        url: 'https://catalog.ggc.edu/preview_course_nopop.php?catoid=20&coid=3623',
      },
    ],
  },
];

export const OER_CATALOG: OerResource[] = [
  {
    id: 'oer-1',
    title: 'Open Writing Practices',
    source: 'Open ALG',
    url: 'https://alg.manifoldapp.org/projects/open-writing-practices',
    resourceType: 'Textbook',
    summary:
      'An open textbook covering rhetorical awareness, drafting, revision, and source integration.',
    tags: ['writing', 'research', 'rhetoric', 'revision', 'academic'],
    openLicense: true,
    licenseName: 'CC BY 4.0',
    suggestedUse:
      'Use chapters as weekly readings and adapt revision activities into low-stakes assignments.',
    accessibilityScore: 4,
    adaptabilityScore: 5,
    peerReviewed: true,
  },
  {
    id: 'oer-2',
    title: 'Introduction to Research Methods',
    source: 'Open ALG',
    url: 'https://alg.manifoldapp.org/projects/introduction-to-research-methods',
    resourceType: 'Textbook',
    summary: 'Foundational methods text focused on qualitative and quantitative research design.',
    tags: ['research', 'methods', 'statistics', 'analysis', 'ethics'],
    openLicense: true,
    licenseName: 'CC BY-SA 4.0',
    suggestedUse: 'Map each unit to syllabus methods outcomes and pair with local data examples.',
    accessibilityScore: 5,
    adaptabilityScore: 4,
    peerReviewed: true,
  },
  {
    id: 'oer-3',
    title: 'Critical Thinking Toolkit',
    source: 'OER Commons',
    url: 'https://www.oercommons.org/',
    resourceType: 'Assignment Bank',
    summary: 'Reusable classroom activities for evaluating arguments, evidence, and claims.',
    tags: ['critical', 'thinking', 'arguments', 'analysis', 'evaluation'],
    openLicense: true,
    licenseName: 'CC BY-NC 4.0',
    suggestedUse: 'Assign activities as formative checks before major projects.',
    accessibilityScore: 4,
    adaptabilityScore: 5,
    peerReviewed: false,
  },
  {
    id: 'oer-4',
    title: 'Biology 2e',
    source: 'OpenStax',
    url: 'https://openstax.org/details/books/biology-2e',
    resourceType: 'Textbook',
    summary: 'Comprehensive biology OER for intro biology lecture and lab integration.',
    tags: ['biology', 'genetics', 'ecology', 'evolution', 'lab'],
    openLicense: true,
    licenseName: 'CC BY 4.0',
    suggestedUse: 'Replace paid biology text and map chapters to lab and lecture sequence.',
    accessibilityScore: 5,
    adaptabilityScore: 4,
    peerReviewed: true,
  },
  {
    id: 'oer-5',
    title: 'U.S. History',
    source: 'OpenStax',
    url: 'https://openstax.org/details/books/us-history',
    resourceType: 'Textbook',
    summary: 'Open U.S. history text for survey courses with primary source coverage.',
    tags: ['history', 'american', 'primary', 'constitution', 'civic'],
    openLicense: true,
    licenseName: 'CC BY 4.0',
    suggestedUse: 'Use chapter modules and source analysis prompts for discussion boards.',
    accessibilityScore: 5,
    adaptabilityScore: 4,
    peerReviewed: true,
  },
  {
    id: 'oer-6',
    title: 'Introduction to Computer Science',
    source: 'Open Textbook Library',
    url: 'https://open.umn.edu/opentextbooks',
    resourceType: 'Textbook',
    summary: 'Computing fundamentals, digital systems, and problem-solving workflows.',
    tags: ['computing', 'digital', 'software', 'systems', 'problem'],
    openLicense: true,
    licenseName: 'CC BY-NC-SA 4.0',
    suggestedUse: 'Adopt selected modules to support ITEC 1001 foundational learning outcomes.',
    accessibilityScore: 4,
    adaptabilityScore: 4,
    peerReviewed: false,
  },
];
