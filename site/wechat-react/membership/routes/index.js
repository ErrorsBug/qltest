import App from '../../app.js';

import { MemberFreeCourses } from './member-free-courses';
import { 
    MemberCenter, 
    MasterCourse, 
    ExperienceInvitation,
    ExperienceCard,
	OfficialExperienceCard,
    ReceiveStatus,
	RulesIntro,
} from './member-center';

const rootRoute = {
    path: '/wechat/page',
    component: App,
    childRoutes: [
        MemberCenter,
        MasterCourse,
	    MemberFreeCourses,
        ExperienceCard,
	    OfficialExperienceCard,
        ExperienceInvitation,
        ExperienceCard,
        ReceiveStatus,
	    RulesIntro
    ]
};

export default rootRoute;
