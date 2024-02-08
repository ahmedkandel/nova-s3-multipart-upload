import Tool from './components/Tool'

Nova.booting((app, store) => {
  app.component('nova-s3-multipart-upload', Tool)
})
