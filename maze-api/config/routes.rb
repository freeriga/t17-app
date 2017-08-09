Rails.application.routes.draw do
  resources :spots
  resources :clipfiles
  resources :clips
  resources :mazes

  get "/blobs/:sha2", to: "clipfiles#download"
end
