import {repository} from '@loopback/repository';
import {get, response} from '@loopback/rest';
import {FormData, UserData} from '../models';
import {
  AssignmentDataRepository,
  FormDataRepository,
  LocationDataRepository,
  SubmissionDataRepository,
  UserDataRepository,
} from '../repositories';

export class ReportingController {
  constructor(
    @repository(AssignmentDataRepository)
    private readonly assignmentRepo: AssignmentDataRepository,
    @repository(UserDataRepository)
    private readonly userRepo: UserDataRepository,
    @repository(SubmissionDataRepository)
    private readonly submissionRepo: SubmissionDataRepository,
    @repository(LocationDataRepository)
    private readonly locationRepo: LocationDataRepository,
    @repository(FormDataRepository)
    private readonly formDataRepo: FormDataRepository,
  ) {}

  async getUsersByIds(userIds: number[]): Promise<UserData[]> {
    return this.userRepo.find({where: {id: {inq: userIds}}});
  }

  async getFormDataById(dcfId: number): Promise<FormData | null> {
    return this.formDataRepo.findOne({where: {id: dcfId}});
  }

  async getSortedEntity(level: number, locationId: number) {
    const locations = await this.locationRepo.find();

    const locationMap = new Map(
      locations.map(loc => [
        loc.id,
        {id: loc.id, locationData: loc.locationData},
      ]),
    );

    const locationTwoMap = new Map(
      locations.flatMap(
        loc =>
          loc.locationTwos?.map(locTwo => [
            locTwo.id,
            {id: locTwo.id, locationData: locTwo.locationData},
          ]) || [],
      ),
    );

    const locationThreeMap = new Map(
      locations.flatMap(
        loc =>
          loc.locationTwos?.flatMap(
            locTwo =>
              locTwo.locationThrees?.map(locThree => [
                locThree.id,
                {id: locThree.id, locationData: locThree.locationData},
              ]) || [],
          ) || [],
      ),
    );

    return (
      (level === 1 && locationMap.get(locationId)) ||
      (level === 2 && locationTwoMap.get(locationId)) ||
      (level === 3 && locationThreeMap.get(locationId)) ||
      'No Data Found'
    );
  }

  calculateReportingPeriods(
    startDate: string,
    endDate: string,
    frequency: number,
  ): string[][] {
    const periods: string[][] = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const periodGroup: string[] = [];
      for (let i = 0; i < frequency && currentDate <= end; i++) {
        periodGroup.push(
          `${String(currentDate.getMonth() + 1).padStart(2, '0')}-${currentDate.getFullYear()}`,
        );
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      periods.push(periodGroup);
    }

    return periods;
  }

  getSubmissionStatus(submission: any): string {
    return submission?.type
      ? ['Pending Submission', 'Under Review', 'Under Approval', 'Approved'][
          submission.type
        ] || 'Pending Submission'
      : 'Pending Submission';
  }

  @get('/generate-report')
  @response(200, {
    description: 'Generate Report of Submissions with Status Mapping',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              dcfId: {type: 'number'},
              reporting_period: {type: 'string'},
              status: {type: 'string'},
              reporter: {type: 'string'},
              reviewer: {type: 'string'},
              entity: {type: 'object'},
            },
          },
        },
      },
    },
  })
  async generateReport(): Promise<any[]> {
    const [assignments, submissions] = await Promise.all([
      this.assignmentRepo.find(),
      this.submissionRepo.find(),
    ]);

    const reportData: any[] = [];

    for (const assignment of assignments) {
      const expectedPeriods = this.calculateReportingPeriods(
        assignment.start_date,
        assignment.end_date,
        assignment.frequency,
      );

      const [reporters, reviewers, entity, formData] = await Promise.all([
        this.getUsersByIds(assignment.reporter_ids),
        this.getUsersByIds(assignment.reviewer_ids ?? []),
        this.getSortedEntity(assignment.level, assignment.locationId),
        this.getFormDataById(assignment.dcfId),
      ]);

      const reporterNames = reporters.map(user => ({
        id: user.id,
        name: user.information['empname'],
      }));
      const reviewerNames = reviewers.map(user => ({
        id: user.id,
        name: user.information['empname'],
      }));

      for (const periodGroup of expectedPeriods) {
        const formattedPeriods = periodGroup.map(period => {
          const [month, year] = period.split('-');
          return `${month.padStart(2, '0')}-${year}`;
        });

        const submission = submissions.find(
          sub =>
            sub.dcfId === assignment.dcfId &&
            sub.locationId === assignment.locationId &&
            formattedPeriods.some(fp => sub.reporting_period.includes(fp)),
        );

        reportData.push({
          dcfId: assignment.dcfId,
          reporting_period: formattedPeriods,
          status: this.getSubmissionStatus(submission),
          reporter: reporterNames,
          reviewer: reviewerNames,
          entity,
          formData,
        });
      }
    }

    return reportData;
  }
}
