import App from '../../app.js';
import { 
    UniversityHome, 
    LearningCamp, 
    LearningCampOther, 
    CampIntro, 
    ClassInfo, 
    ClassInfoCode, 
    MyFile, 
    CompulsoryList,
    BooksList, 
    CollegeDetail,
    TutorList,
    InvitationCard,
    Withdraw,
    MyCourseList,
    NoticeCard,
    InviteDetail,
    ClassCode,
    TopRanking,
    ShowQrcode,
    PopularityRank,
    OpenCalendar,
} from './home-router' 
import {  
    CourseExam,
    CourseExamList,
    StudyAdvice,
} from './exam-router' 
import { JoinUniversity, JoinUniversityCountdown, JoinUniversitySuccess, JoinUniversityCourses, CollegesIntro,   StatisticalTable, ActivityUrl, ComposeActivity, UniversityExperienceSuccess, EBook, EAlbums } from './join-router' 
import { FlagAdd, FlagList, FlagWait, FlagHome,FlagOther, FlagRecard, FlagPublish, FlagShow,FlagCardDetail } from './flag-router'
import { 
    ExperienceCampScholarship,
    ExperienceCampActivity,
    ExperienceCampWithdraw,
    ExperienceCampWithdrawList,
    ExperienceCampList,
    ExperienceBottomPage,
    UniversityExperienceCamp,
    UnExperienceCamp,
    ExperienceFinance,
    ExperienceFinanceBottom,
    ExperienceFinanceCard,
    ExperienceFinanceBuyed,
    ExperienceFinancePoster,
    ExperienceFinanceScholarship,
    ExperienceFinanceWithdraw,
    ExperienceFinanceInviteDetail,
    ExperienceCampInvite,
    ExperienceCampInviteList,
    ExperienceCampExchange, } from './experience-router' 

import { FamilyCard, FamilyOther, ExperienceCard, FamilyCampList } from './family-card-router'

const rootRoute = {
    path: '/wechat/page',
    component: App,
    childRoutes: [
        UniversityHome,
        CampIntro,
        JoinUniversity,
        JoinUniversityCountdown,
        JoinUniversitySuccess,
        JoinUniversityCourses,
        LearningCamp,
        LearningCampOther,
        ClassInfo,
        ClassInfoCode,
        MyFile, 
        CompulsoryList,
        BooksList,
        CollegeDetail,
        TutorList,
        InvitationCard,
        Withdraw,
        MyCourseList,
        FlagAdd,
        FlagList,
        FlagWait,
        FlagHome,
        FlagOther,
        FlagRecard,
        FlagPublish,
        FlagShow,
        FlagCardDetail,
        NoticeCard,
        InviteDetail,
        ClassCode,
        CollegesIntro,
        CourseExam,
        CourseExamList,
        StudyAdvice,
        UnExperienceCamp,
        UniversityExperienceCamp,
        TopRanking,
        FamilyCard,
        FamilyOther,
        ExperienceBottomPage,
        ExperienceCampList,
        ExperienceCard,
        FamilyCampList,
        StatisticalTable,
        ExperienceFinance,
        ExperienceFinanceBottom,
        ExperienceFinanceCard,
        ExperienceFinanceBuyed,
        ActivityUrl,
        ShowQrcode,
        PopularityRank,
        ExperienceFinancePoster,
        ComposeActivity,
        ExperienceFinanceScholarship,
        ExperienceFinanceWithdraw,
        ExperienceFinanceInviteDetail,
        UniversityExperienceSuccess,
        ExperienceCampWithdraw,
        ExperienceCampWithdrawList,
        ExperienceCampActivity,
        ExperienceCampScholarship,
        ExperienceCampInvite,
        ExperienceCampInviteList,
        OpenCalendar,
        EBook,
        ExperienceCampExchange,
        EAlbums,
    ]
};

export default rootRoute;
