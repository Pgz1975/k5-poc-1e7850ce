export const mockComparativeData = {
  thisClass: 87,
  otherGrade3Classes: 84,
  schoolAverage: 82,
  regionalAverage: 80,
  islandAverage: 78,
  skillsComparison: {
    comprehension: {
      thisClass: 88,
      schoolAvg: 85,
      regionalAvg: 82,
      islandAvg: 80
    },
    fluency: {
      thisClass: 85,
      schoolAvg: 83,
      regionalAvg: 81,
      islandAvg: 79
    },
    vocabulary: {
      thisClass: 90,
      schoolAvg: 84,
      regionalAvg: 80,
      islandAvg: 78
    },
    pronunciation: {
      thisClass: 82,
      schoolAvg: 80,
      regionalAvg: 78,
      islandAvg: 75
    }
  }
};

export const mockScheduleComparison = {
  morning: {
    average: 88,
    attendance: 95,
    engagement: 92,
    completionRate: 89
  },
  afternoon: {
    average: 85,
    attendance: 91,
    engagement: 87,
    completionRate: 84
  }
};

export const mockGradeComparison = [
  { grade: "K", average: 75 },
  { grade: "1", average: 78 },
  { grade: "2", average: 81 },
  { grade: "3", average: 87, highlight: true },
  { grade: "4", average: 84 },
  { grade: "5", average: 86 }
];

export const mockSchoolComparison = [
  { school: "Escuela Julia de Burgos", average: 87, students: 125, highlight: true },
  { school: "Escuela José de Diego", average: 84, students: 98 },
  { school: "Escuela Rafael Hernández", average: 82, students: 110 },
  { school: "Escuela Eugenio María de Hostos", average: 80, students: 105 },
  { school: "Escuela Luis Muñoz Rivera", average: 79, students: 92 }
];
