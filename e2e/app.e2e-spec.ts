import { TrackfyWebPage } from './app.po';

describe('trackfy-web App', () => {
  let page: TrackfyWebPage;

  beforeEach(() => {
    page = new TrackfyWebPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
