import { compose } from 'react-apollo'

import liveInfo from './live-info';
import planCourseList from './plan-course-list';
import purchaseCourse from './purchase-course';

export default compose(
    liveInfo,
    planCourseList,
    purchaseCourse
);
