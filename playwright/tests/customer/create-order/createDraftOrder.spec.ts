import { ContentType, Language, LineSpacing, ServiceType, SizeType } from '@gt-types/enums/createOrder.ts';
import { PaymentError, PaymentStatus } from '@gt-types/enums/paymentResults.ts';

import { Constants } from '@gt-test-data/constants/constants.ts';
import { DateIntervals } from '@gt-types/dates.ts';
import { baseFixture } from '@gt-test-data/index.ts';
import { faker } from '@faker-js/faker';
import { logoutViaApi } from '@gt-helpers/auth/auth.helper.ts';
import { mergeTests } from '@playwright/test';

const test = mergeTests(baseFixture);
let topic: string;

test.describe('ID-1 Check of Creating draft order', { tag: ['@smoke', '@customer', '@createOrder'] }, () => {
  test.beforeEach(() => {
    topic = `KONOVALOV TASK ${faker.string.alphanumeric(10)}`;
  });

  test('Check of creating draft Website content order', { tag: ['@smoke'] }, async ({ customer }) => {
    await test.step('Fill order form', async () => {
      await customer.createOrder.open();
      await customer.createOrder.selectContentType(ContentType.WEBSITE_CONTENT);
      await customer.createOrder.setServiceRadio(ServiceType.WRITING);
      await customer.createOrder.setLanguageRadio(Language.ENGLISH_UK);
      await customer.createOrder.setSize({
        sizeType: SizeType.PAGES,
        quantity: 15,
        lineSpacing: LineSpacing.DOUBLE,
      });
      await customer.createOrder.setDeadline(DateIntervals.FUTURE, { minutes: '30', hours: '02', meridiem: 'PM' });
      await customer.createOrder.setTopic(topic);
      await customer.createOrder.setThemeViaRadio('English');
      await customer.createOrder.setContentRequirements(faker.string.alphanumeric(20));
      await customer.createOrder.expectEstimatedPrice('$150.00');
      await customer.createOrder.submitOrder();
    });
    await test.step('Proceed with failed payment', async () => {
      await customer.createOrder.depositDialog.expectLoaded();
      await customer.createOrder.depositDialog.expectDepositAmount('$150.00');
      await customer.createOrder.depositDialog.proceedToPaymentDetails();
      await customer.createOrder.depositDialog.fillCardDetailsAndProceed({
        cardNumber: Constants.TEST_CARD_NUMBER,
        cardHolderName: Constants.TEST_CARD_HOLDER_NAME,
        expiryDate: Constants.TEST_CARD_EXPIRE_DATE,
        cvv: Constants.TEST_CARD_CVV,
      });
      await customer.createOrder.expectPaymentResult(PaymentStatus.FAILED);
      await customer.createOrder.expectPaymentResult(`Transaction has been failed: ${PaymentError.ANTIFRAUD_SERVICE}`);
      await customer.createOrder.depositDialog.close();
    });
    await test.step('Check that draft order is created', async () => {
      await customer.myOrders.expectLoaded();
      await customer.myOrders.draftsTab.select();
      await customer.myOrders.orderItem.checkOrderDetails({
        title: topic,
        size: '15 pages',
        contentType: ContentType.WEBSITE_CONTENT,
        language: Language.ENGLISH_UK,
        status: 'Draft',
        price: '150.00',
      });
    });
  });

  // TODO: Add .skip() should be added due to missing PowerPoint presentation content type after presentation
  test('Check of creating draft PowerPoint presentation order', { tag: ['@smoke'] }, async ({ customer }) => {
    await test.step('Fill new order form', async () => {
      await customer.createOrder.open();
      await customer.createOrder.selectContentType(ContentType.POWERPOINT_PRESENTATION);
      await customer.createOrder.setServiceRadio(ServiceType.WRITING);
      await customer.createOrder.setLanguageRadio(Language.ENGLISH_UK);
      await customer.createOrder.setSize({
        sizeType: SizeType.SLIDES,
        quantity: 5,
        lineSpacing: LineSpacing.DOUBLE,
      });
      await customer.createOrder.setDeadline(DateIntervals.FUTURE, { minutes: '30', hours: '02', meridiem: 'PM' });
      await customer.createOrder.setTopic(topic);
      await customer.createOrder.setThemeViaRadio('English');
      await customer.createOrder.setContentRequirements(faker.string.alphanumeric(20));
      await customer.createOrder.expectEstimatedPrice('$150.00');
      await customer.createOrder.submitOrder();
    });
    await test.step('Proceed with failed payment', async () => {
      await customer.createOrder.depositDialog.expectLoaded();
      await customer.createOrder.depositDialog.expectDepositAmount('$150.00');
      await customer.createOrder.depositDialog.proceedToPaymentDetails();
      await customer.createOrder.depositDialog.fillCardDetailsAndProceed({
        cardNumber: Constants.TEST_CARD_NUMBER,
        cardHolderName: Constants.TEST_CARD_HOLDER_NAME,
        expiryDate: Constants.TEST_CARD_EXPIRE_DATE,
        cvv: Constants.TEST_CARD_CVV,
      });
      await customer.createOrder.expectPaymentResult(PaymentStatus.FAILED);
      await customer.createOrder.expectPaymentResult(`Transaction has been failed: ${PaymentError.ANTIFRAUD_SERVICE}`);
      await customer.createOrder.depositDialog.close();
    });
    await test.step('Check that draft order is created', async () => {
      await customer.myOrders.expectLoaded();
      await customer.myOrders.draftsTab.select();
      await customer.myOrders.orderItem.checkOrderDetails({
        title: topic,
        size: '5 slides',
        contentType: ContentType.POWERPOINT_PRESENTATION,
        language: Language.ENGLISH_UK,
        status: 'Draft',
        price: '150.00',
      });
    });
  });

  test.afterEach(async ({ customer }) => {
    await customer.myOrders.orderItem.removeOrder(topic);
    await customer.myOrders.confirmationDialog.delete();
    await customer.myOrders.orderItem.expectNotExist(topic);
    // TODO: Add empty state check and report bug cause now just blank block is displayed
  });

  test.afterAll(async () => {
    // TODO: Add user deactivation when apiService will be ready
    await logoutViaApi();
  });
});
