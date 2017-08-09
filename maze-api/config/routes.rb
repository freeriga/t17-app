Rails.application.routes.draw do
  resources :clipfiles
  resources :clips
  resources :mazes

  get "/blobs/:sha2", to: "clipfiles#download"
end
